export class WebhookEventPayloadDto {
  eventType: string;
  data: any;
  metadata?: {
    timestamp: string;
    [key: string]: any;
  };
}
