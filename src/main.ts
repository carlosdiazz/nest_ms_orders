import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('ORDERS-MAIN');
  console.log(envs);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      options: {
        port: envs.PORT,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve todo lo que no está incluído en los DTOs
      forbidNonWhitelisted: true, // Retorna bad request si hay propiedades en el objeto no requeridas
      //Agregue esto apra devolver errores RpcException
      exceptionFactory: (errors) =>
        new RpcException({
          status: 400,
          message: errors
            .map((err) => Object.values(err.constraints ?? ''))
            .join(', '),
        }),
    }),
  );

  await app.listen();
  logger.debug(`👍Server up => PORT => ${envs.PORT} 👍💪👍💪👍💪`);
}
void bootstrap();
