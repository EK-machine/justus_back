import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const user = configService.get('RABBITMQ_DEFAULT_USER');
  const pass = configService.get('RABBITMQ_DEFAULT_PASS');
  const host = configService.get('RABBITMQ_HOST');
  const queue = configService.get('RBAC_RMQ_QUEUE');
  const port = configService.get('RBAC_PORT');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pass}@${host}`],
      queue,
      queueOptions: {
        durable: false,
      },
      noAck: false,
    }
  });

  await app.startAllMicroservices();

  await app.listen(port ?? 8082);
}
bootstrap();
