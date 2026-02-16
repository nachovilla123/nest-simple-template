import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookReceiverService } from '../services/webhook-receiver.service';
import { WebhookIncomingResponseDto } from '../dtos/webhook-incoming-response.dto';

@Controller('webhook-receiver')
export class WebhookReceiverController {
  private readonly logger = new Logger(WebhookReceiverController.name);

  constructor(
    private readonly receiverService: WebhookReceiverService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async receive(
    @Query('source') source: string,
    @Body() payload: any,
    @Headers() headers: Record<string, string>,
  ): Promise<{ id: string; received: boolean }> {
    this.logger.log(`Received webhook from source: ${source || 'unknown'}`);

    const secret = this.configService.get<string>('WEBHOOK_RECEIVER_SECRET');

    const incoming = await this.receiverService.receiveWebhook(
      source,
      payload,
      headers,
      secret,
    );

    return {
      id: incoming.id,
      received: true,
    };
  }

  @Get()
  async findAll(): Promise<WebhookIncomingResponseDto[]> {
    const incomingWebhooks = await this.receiverService.findAll();
    return incomingWebhooks.map((webhook) =>
      WebhookIncomingResponseDto.fromEntity(webhook),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WebhookIncomingResponseDto> {
    const incoming = await this.receiverService.findOne(id);
    return WebhookIncomingResponseDto.fromEntity(incoming);
  }
}
