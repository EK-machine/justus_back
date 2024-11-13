import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_CLIENT } from '@app/contracts/user';
import { RBAC_CLIENT } from '@app/contracts/rbac';
import { Orchestrator } from '../orchestrator/orchestrator';

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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, Orchestrator],
})
export class UserModule {}
