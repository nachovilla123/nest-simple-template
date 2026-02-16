import { WebhookSubscription } from '../entities/webhook-subscription.entity';

export class WebhookSubscriptionResponseDto {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  maxRetries: number;
  timeoutMs: number;
  headers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: WebhookSubscription): WebhookSubscriptionResponseDto {
    const dto = new WebhookSubscriptionResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.url = entity.url;
    dto.events = entity.events;
    dto.isActive = entity.isActive;
    dto.maxRetries = entity.maxRetries;
    dto.timeoutMs = entity.timeoutMs;
    dto.headers = entity.headers;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    // Note: secret is intentionally excluded for security
    return dto;
  }
}
