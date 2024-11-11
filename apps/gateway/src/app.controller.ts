import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('check-health')
  @HttpCode(HttpStatus.OK)
  checkHealth(): Promise<boolean> {
    return this.appService.checkHealth();
  }
}
