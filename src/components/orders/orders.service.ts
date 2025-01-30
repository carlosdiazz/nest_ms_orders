import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrdersAllDto } from './dto/orders-all.dto';
import { NAME_PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(NAME_PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('DATABASE UP');
  }

  public async create(createOrderDto: CreateOrderDto) {
    const productsIds = createOrderDto.items.map((item) => item.productId);

    //return (price * orderItem.quantity) +acc

    try {
      //1. Confirmar los ids de los Productos
      const products: any[] = await firstValueFrom(
        this.productsClient.send(
          { name: 'validateProducts' },
          { ids: productsIds },
        ),
      );

      //2. Calcular El TotalAmount
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (product) => product.id === orderItem.productId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ).price;

        return price * orderItem.quantity + acc;
      }, 0);

      //3. Calcular el totalItem
      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //4. Crear una transacion de base de datos
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  (product) => product.id === orderItem.productId,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ).price,
                quantity: orderItem.quantity,
                productId: orderItem.productId,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
            },
          },
        },
      });

      return order;
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new RpcException(e);
    }
  }

  public async findAll(orderPaginationDto: OrdersAllDto) {
    const { limit, page, status } = orderPaginationDto;

    return await this.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        status,
      },
    });
  }

  public async findOne(id: string) {
    const order = await this.order.findFirst({
      where: {
        id,
      },
      include: {
        OrderItem: {
          select: {
            price: true,
            productId: true,
            quantity: true,
          },
        },
      },
    });
    if (!order) {
      throw new RpcException({
        message: `Order with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return order;
  }

  public async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);

    if (order.status === status) return;

    return await this.order.update({
      where: { id },
      data: { status },
    });
  }
}
