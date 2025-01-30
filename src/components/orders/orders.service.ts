import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrdersAllDto } from './dto/orders-all.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('DATABASE UP');
  }

  public async create(createOrderDto: CreateOrderDto) {
    const order = await this.order.create({
      data: createOrderDto,
    });
    return order;
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
