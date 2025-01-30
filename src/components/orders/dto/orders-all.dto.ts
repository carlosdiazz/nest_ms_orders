import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';

//Propio
import { PaginationDto } from 'src/common';
import { OrdersStatusList } from '../enum/order.enum';

export class OrdersAllDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrdersStatusList, {
    message: `Possible status values are ${OrdersStatusList.join(', ')}`,
  })
  status: OrderStatus;
}

export class ChangeOrderStatusDto {
  @IsUUID(4)
  id: string;

  @IsEnum(OrdersStatusList, {
    message: `Possible status values are ${OrdersStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
