import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { WebhookSubscription } from '../entities/webhook-subscription.entity';
import { WebhookDelivery } from '../entities/webhook-delivery.entity';
import { CreateWebhookSubscriptionDto } from '../dtos/create-webhook-subscription.dto';
import { UpdateWebhookSubscriptionDto } from '../dtos/update-webhook-subscription.dto';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(WebhookSubscription)
    private readonly subscriptionsRepository: Repository<WebhookSubscription>,
    @InjectRepository(WebhookDelivery)
    private readonly deliveriesRepository: Repository<WebhookDelivery>,
  ) {}

  async create(
    createDto: CreateWebhookSubscriptionDto,
  ): Promise<WebhookSubscription> {
    const subscription = this.subscriptionsRepository.create({
      ...createDto,
      secret: createDto.secret || this.generateSecret(),
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async findAll(): Promise<WebhookSubscription[]> {
    return this.subscriptionsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<WebhookSubscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Webhook subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async update(
    id: string,
    updateDto: UpdateWebhookSubscriptionDto,
  ): Promise<WebhookSubscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateDto);
    return this.subscriptionsRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionsRepository.remove(subscription);
  }

  async findActiveByEvent(eventType: string): Promise<WebhookSubscription[]> {
    const subscriptions = await this.subscriptionsRepository.find({
      where: { isActive: true },
    });

    return subscriptions.filter((sub) => sub.events.includes(eventType));
  }

  async findDeliveries(subscriptionId: string): Promise<WebhookDelivery[]> {
    await this.findOne(subscriptionId);

    return this.deliveriesRepository.find({
      where: { subscriptionId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  private generateSecret(): string {
    return randomBytes(32).toString('hex');
  }
}
