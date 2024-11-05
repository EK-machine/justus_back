import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const user = configService.get('RABBITMQ_DEFAULT_USER');
  const pass = configService.get('RABBITMQ_DEFAULT_PASS');
  const host = configService.get('RABBITMQ_HOST');
  const queue = configService.get('USERS_RMQ_QUEUE');
  const port = configService.get('USERS_PORT');

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

  await app.listen(port);
}
bootstrap();
