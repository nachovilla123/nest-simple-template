export interface WebhookEvent {
  eventType: string;
  data: any;
  metadata?: {
    timestamp: string;
    [key: string]: any;
  };
}
