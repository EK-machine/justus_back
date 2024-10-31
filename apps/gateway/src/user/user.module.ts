import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_CLIENT } from '@app/contracts/user';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_CLIENT,
        imports: [ConfigModule],
        useFactory:(configService: ConfigService) => {
          const user = configService.get('RABBITMQ_DEFAULT_USER');
          const pass = configService.get('RABBITMQ_DEFAULT_PASS');
          const host = configService.get('RABBITMQ_HOST');
          const queue = configService.get('RABBITMQ_USER_QUEUE');
          return {
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${pass}@${host}`],
            queue,
            queueOptions: {
              durable: false,
            },
          }
        }},
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
