import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async checkHealth(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
