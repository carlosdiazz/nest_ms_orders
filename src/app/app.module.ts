import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/components/';

@Module({
  imports: [OrdersModule],
})
export class AppModule {}
