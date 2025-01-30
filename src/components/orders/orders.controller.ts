import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

//Propio
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeOrderStatusDto, OrdersAllDto } from './dto/orders-all.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  private async create(@Payload() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
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
}
