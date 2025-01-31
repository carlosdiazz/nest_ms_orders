import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsModule } from '../transport';
//import { ClientsModule, Transport } from '@nestjs/microservices';
//import { envs, NAME_PRODUCT_SERVICE } from 'src/config';

@Module({
  imports: [
    //ClientsModule.register([
    //  {
    //    name: NAME_PRODUCT_SERVICE,
    //    transport: Transport.TCP,
    //    options: {
    //      host: envs.PRODUCTS_MS_HOST,
    //      port: envs.PRODUCTS_MS_PORT,
    //    },
    //  },
    //]),
    NatsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
