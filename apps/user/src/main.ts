import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule);
  const configService = app.get(ConfigService);
  const user = configService.get('RABBITMQ_DEFAULT_USER');
  const pass = configService.get('RABBITMQ_DEFAULT_PASS');
  const host = configService.get('RABBITMQ_HOST');
  const queue = configService.get('RABBITMQ_USER_QUEUE');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pass}@${host}`],
      queue,
      queueOptions: {
        durable: false,
      },
    }
  });

  await app.startAllMicroservices();

  await app.init();
}
bootstrap();
