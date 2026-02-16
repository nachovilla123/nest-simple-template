import { WebhookDelivery } from '../entities/webhook-delivery.entity';

export class WebhookDeliveryResponseDto {
  id: string;
  subscriptionId: string;
  eventType: string;
  payload: any;
  status: string;
  httpStatusCode: number;
  responseBody: string;
  errorMessage: string;
  attempts: number;
  deliveredAt: Date;
  createdAt: Date;

  static fromEntity(entity: WebhookDelivery): WebhookDeliveryResponseDto {
    const dto = new WebhookDeliveryResponseDto();
    dto.id = entity.id;
    dto.subscriptionId = entity.subscriptionId;
    dto.eventType = entity.eventType;
    dto.payload = entity.payload;
    dto.status = entity.status;
    dto.httpStatusCode = entity.httpStatusCode;
    dto.responseBody = entity.responseBody;
    dto.errorMessage = entity.errorMessage;
    dto.attempts = entity.attempts;
    dto.deliveredAt = entity.deliveredAt;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
