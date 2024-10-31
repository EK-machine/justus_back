import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('GATEWAY_PORT');

  app.enableCors();
  await app.listen(port);
}
bootstrap();
