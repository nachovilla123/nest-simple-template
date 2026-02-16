import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebhooksService } from '../services/webhooks.service';
import { CreateWebhookSubscriptionDto } from '../dtos/create-webhook-subscription.dto';
import { UpdateWebhookSubscriptionDto } from '../dtos/update-webhook-subscription.dto';
import { WebhookSubscriptionResponseDto } from '../dtos/webhook-subscription-response.dto';
import { WebhookDeliveryResponseDto } from '../dtos/webhook-delivery-response.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  async create(
    @Body() createDto: CreateWebhookSubscriptionDto,
  ): Promise<WebhookSubscriptionResponseDto> {
    const subscription = await this.webhooksService.create(createDto);
    return WebhookSubscriptionResponseDto.fromEntity(subscription);
  }

  @Get()
  async findAll(): Promise<WebhookSubscriptionResponseDto[]> {
    const subscriptions = await this.webhooksService.findAll();
    return subscriptions.map((sub) =>
      WebhookSubscriptionResponseDto.fromEntity(sub),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WebhookSubscriptionResponseDto> {
    const subscription = await this.webhooksService.findOne(id);
    return WebhookSubscriptionResponseDto.fromEntity(subscription);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWebhookSubscriptionDto,
  ): Promise<WebhookSubscriptionResponseDto> {
    const subscription = await this.webhooksService.update(id, updateDto);
    return WebhookSubscriptionResponseDto.fromEntity(subscription);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.webhooksService.remove(id);
  }

  @Get(':id/deliveries')
  async getDeliveries(
    @Param('id') id: string,
  ): Promise<WebhookDeliveryResponseDto[]> {
    const deliveries = await this.webhooksService.findDeliveries(id);
    return deliveries.map((delivery) =>
      WebhookDeliveryResponseDto.fromEntity(delivery),
    );
  }
}
