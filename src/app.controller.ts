import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test/webhook-receiver')
  async testWebhookReceiver(@Body() payload: any) {
    this.logger.log('Test webhook received:');
    this.logger.log(JSON.stringify(payload, null, 2));
    return { received: true, timestamp: new Date().toISOString() };
  }
}
