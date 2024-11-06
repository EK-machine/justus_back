import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('GATEWAY_PORT');

  app.enableCors();
  await app.listen(port ?? 8080);
}
bootstrap();
