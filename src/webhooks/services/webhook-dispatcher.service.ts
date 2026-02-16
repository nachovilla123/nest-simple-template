import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { WebhookDelivery } from '../entities/webhook-delivery.entity';
import { WebhookSubscription } from '../entities/webhook-subscription.entity';
import { WebhooksService } from './webhooks.service';
import * as webhookEventInterface from '../interfaces/webhook-event.interface';
import { WebhookDeliveryStatus } from '../enums/webhook-delivery-status.enum';

@Injectable()
export class WebhookDispatcherService {
  private readonly logger = new Logger(WebhookDispatcherService.name);

  constructor(
    @InjectRepository(WebhookDelivery)
    private readonly deliveriesRepository: Repository<WebhookDelivery>,
    private readonly webhooksService: WebhooksService,
  ) {}

  @OnEvent('webhook.**', { async: true })
  async handleWebhookEvent(event: webhookEventInterface.WebhookEvent): Promise<void> {
    this.logger.log(`Received event: ${event.eventType}`);

    const subscriptions = await this.webhooksService.findActiveByEvent(
      event.eventType,
    );

    if (subscriptions.length === 0) {
      this.logger.debug(
        `No active subscriptions found for event: ${event.eventType}`,
      );
      return;
    }

    this.logger.log(
      `Found ${subscriptions.length} subscription(s) for event: ${event.eventType}`,
    );

    for (const subscription of subscriptions) {
      await this.dispatchWebhook(subscription, event);
    }
  }

  private async dispatchWebhook(
    subscription: WebhookSubscription,
    event: webhookEventInterface.WebhookEvent,
  ): Promise<void> {
    const delivery = await this.createDelivery(subscription, event);

    await this.sendWithRetry(subscription, event, delivery);
  }

  private async createDelivery(
    subscription: WebhookSubscription,
    event: webhookEventInterface.WebhookEvent,
  ): Promise<WebhookDelivery> {
    const delivery = this.deliveriesRepository.create({
      subscriptionId: subscription.id,
      eventType: event.eventType,
      payload: event,
      status: WebhookDeliveryStatus.PENDING,
      attempts: 0,
    });

    return this.deliveriesRepository.save(delivery);
  }

  private async sendWithRetry(
    subscription: WebhookSubscription,
    event: webhookEventInterface.WebhookEvent,
    delivery: WebhookDelivery,
  ): Promise<void> {
    const maxAttempts = subscription.maxRetries + 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.debug(
          `Attempting delivery ${attempt}/${maxAttempts} for ${subscription.url}`,
        );

        delivery.attempts = attempt;
        delivery.status =
          attempt > 1
            ? WebhookDeliveryStatus.RETRYING
            : WebhookDeliveryStatus.PENDING;
        await this.deliveriesRepository.save(delivery);

        const response = await this.sendHttpRequest(subscription, event);

        delivery.status = WebhookDeliveryStatus.SUCCESS;
        delivery.httpStatusCode = response.status;
        delivery.responseBody = response.body.substring(0, 5000);
        delivery.deliveredAt = new Date();
        await this.deliveriesRepository.save(delivery);

        this.logger.log(
          `Successfully delivered webhook to ${subscription.url} (attempt ${attempt})`,
        );
        return;
      } catch (error) {
        this.logger.warn(
          `Failed to deliver webhook to ${subscription.url} (attempt ${attempt}/${maxAttempts}): ${error.message}`,
        );

        delivery.errorMessage = error.message;
        delivery.httpStatusCode = error.statusCode || null;

        if (attempt < maxAttempts) {
          const backoffSeconds = Math.pow(2, attempt);
          this.logger.debug(`Retrying in ${backoffSeconds} seconds...`);
          await this.sleep(backoffSeconds * 1000);
        } else {
          delivery.status = WebhookDeliveryStatus.FAILED;
          await this.deliveriesRepository.save(delivery);
          this.logger.error(
            `Failed to deliver webhook to ${subscription.url} after ${maxAttempts} attempts`,
          );
        }
      }
    }
  }

  private async sendHttpRequest(
    subscription: WebhookSubscription,
    event: webhookEventInterface.WebhookEvent,
  ): Promise<{ status: number; body: string }> {
    const payload = JSON.stringify(event);
    const signature = this.generateSignature(payload, subscription.secret);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'User-Agent': 'NestJS-Webhook-Dispatcher/1.0',
      ...subscription.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      subscription.timeoutMs,
    );

    try {
      const response = await fetch(subscription.url, {
        method: 'POST',
        headers,
        body: payload,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text();

      if (!response.ok) {
        const error: any = new Error(
          `HTTP ${response.status}: ${response.statusText}`,
        );
        error.statusCode = response.status;
        throw error;
      }

      return {
        status: response.status,
        body: responseBody,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${subscription.timeoutMs}ms`);
      }

      throw error;
    }
  }

  private generateSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
