import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePayment: string;

  @IsString()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsUrl()
  receiptUrl: string;
}
