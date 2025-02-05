import { OrderStatus } from '@prisma/client';

export interface OrderWithProducts {
  OrderItem: {
    productId: number;
    name: any;
    quantity: number;
    price: number;
  }[];
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date | null;
  createAt: Date;
  updateAt: Date;
}
