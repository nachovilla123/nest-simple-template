import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac, timingSafeEqual } from 'crypto';
import { WebhookIncoming } from '../entities/webhook-incoming.entity';

@Injectable()
export class WebhookReceiverService {
  private readonly logger = new Logger(WebhookReceiverService.name);

  constructor(
    @InjectRepository(WebhookIncoming)
    private readonly incomingRepository: Repository<WebhookIncoming>,
  ) {}

  async receiveWebhook(
    source: string,
    payload: any,
    headers: Record<string, string>,
    secret?: string,
  ): Promise<WebhookIncoming> {
    this.logger.log(`Receiving webhook from source: ${source || 'unknown'}`);

    const signature = headers['x-webhook-signature'];
    const signatureValid = secret
      ? this.validateSignature(JSON.stringify(payload), signature, secret)
      : false;

    const incoming = this.incomingRepository.create({
      source: source || 'unknown',
      eventType: payload.eventType || payload.event || null,
      payload,
      headers,
      processingStatus: 'pending',
      signatureValid,
    });

    return this.incomingRepository.save(incoming);
  }

  async findAll(): Promise<WebhookIncoming[]> {
    return this.incomingRepository.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async findOne(id: string): Promise<WebhookIncoming> {
    const incoming = await this.incomingRepository.findOne({
      where: { id },
    });

    if (!incoming) {
      throw new Error(`Webhook incoming with ID ${id} not found`);
    }

    return incoming;
  }

  private validateSignature(
    payload: string,
    receivedSignature: string,
    secret: string,
  ): boolean {
    if (!receivedSignature) {
      return false;
    }

    try {
      const expectedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const receivedBuffer = Buffer.from(receivedSignature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (receivedBuffer.length !== expectedBuffer.length) {
        return false;
      }

      return timingSafeEqual(receivedBuffer, expectedBuffer);
    } catch (error) {
      this.logger.error(`Signature validation error: ${error.message}`);
      return false;
    }
  }
}
