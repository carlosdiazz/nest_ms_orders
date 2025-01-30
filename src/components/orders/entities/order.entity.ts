import { OrderStatus } from '@prisma/client';

export class Order {
  public totalAmount: number;

  public totalItems: number;

  public paid?: boolean;

  public status: OrderStatus;
}
