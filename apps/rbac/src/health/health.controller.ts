import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckService, 
  HealthCheck,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
  HealthCheckResult,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private microservices: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async healthcheck(): Promise<HealthCheckResult> {
    const user = this.configService.get('RABBITMQ_DEFAULT_USER');
    const pass = this.configService.get('RABBITMQ_DEFAULT_PASS');
    const host = this.configService.get('RABBITMQ_HOST');
    const queue = this.configService.get('RBAC_RMQ_QUEUE');
    return this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> =>
        this.database.pingCheck('postgres-rbac'),
      async (): Promise<HealthIndicatorResult> =>
        this.microservices.pingCheck('rabbitmq-rbac', {
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${pass}@${host}`],
            queue,
            queueOptions: {
              durable: false,
            },
          }
        }),
    ]);
  }
}

