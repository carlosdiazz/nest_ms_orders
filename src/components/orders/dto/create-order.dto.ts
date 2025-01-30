//import { OrderStatus } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  //IsBoolean,
  //IsEnum,
  //IsNumber,
  //IsOptional,
  //IsPositive,
  ValidateNested,
} from 'class-validator';
//import { OrdersStatusList } from '../enum/order.enum';
import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  //@IsNumber()
  //@IsPositive()
  //totalAmount: number;
  //
  //@IsNumber()
  //@IsPositive()
  //totalItems: number;
  //
  //@IsEnum(OrdersStatusList, {
  //  message: `Possible status values are ${OrdersStatusList.join(', ')}`,
  //})
  //@IsOptional()
  //status: OrderStatus = OrderStatus.PENDING;
  //
  //@IsBoolean()
  //@IsOptional()
  //paid: boolean = false;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) //Para validar cada objecto
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
