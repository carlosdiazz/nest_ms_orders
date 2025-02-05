import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

//Propio
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeOrderStatusDto, OrdersAllDto } from './dto/orders-all.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  private async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);

    const paymentSession = await this.ordersService.createPaymentSession(order);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...order,
      ...paymentSession,
    };
  }

  @MessagePattern('findAllOrders')
  private async findAll(@Payload() orderPaginationDto: OrdersAllDto) {
    return await this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  private async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return await this.ordersService.findOne(id);
  }

  @MessagePattern('changeStatusOrder')
  private async changeStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return await this.ordersService.changeStatus(changeOrderStatusDto);
  }

  //Aqui recibo el evento
  @EventPattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: any) {
    console.log(paidOrderDto);
  }
}
