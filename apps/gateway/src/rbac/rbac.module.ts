import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RBAC_CLIENT } from '@app/contracts/rbac';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
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
          const queue = configService.get('USERS_RMQ_QUEUE');
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
      },
      {
        name: RBAC_CLIENT,
        imports: [ConfigModule],
        useFactory:(configService: ConfigService) => {
          const user = configService.get('RABBITMQ_DEFAULT_USER');
          const pass = configService.get('RABBITMQ_DEFAULT_PASS');
          const host = configService.get('RABBITMQ_HOST');
          const queue = configService.get('RBAC_RMQ_QUEUE');
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
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
