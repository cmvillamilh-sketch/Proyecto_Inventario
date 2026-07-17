import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      status: 'ok',
      service: 'mante-stock-backend',
      message: 'API ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'mante-stock-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
