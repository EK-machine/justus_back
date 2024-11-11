import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async healthcheck(): Promise<HealthCheckResult> {
    const port = this.configService.get('GATEWAY_PORT');
    return this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> =>
        this.http.pingCheck('http-gateway', `http://localhost:${port}/check-health`),
    ]);
  }
}

