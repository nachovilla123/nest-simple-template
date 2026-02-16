import { WebhookIncoming } from '../entities/webhook-incoming.entity';

export class WebhookIncomingResponseDto {
  id: string;
  source: string;
  eventType: string;
  payload: any;
  headers: Record<string, string>;
  processingStatus: string;
  processingError: string;
  signatureValid: boolean;
  processedAt: Date;
  createdAt: Date;

  static fromEntity(entity: WebhookIncoming): WebhookIncomingResponseDto {
    const dto = new WebhookIncomingResponseDto();
    dto.id = entity.id;
    dto.source = entity.source;
    dto.eventType = entity.eventType;
    dto.payload = entity.payload;
    dto.headers = entity.headers;
    dto.processingStatus = entity.processingStatus;
    dto.processingError = entity.processingError;
    dto.signatureValid = entity.signatureValid;
    dto.processedAt = entity.processedAt;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
