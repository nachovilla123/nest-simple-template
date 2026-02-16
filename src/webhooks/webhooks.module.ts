import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WebhookSubscription } from './entities/webhook-subscription.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { WebhookIncoming } from './entities/webhook-incoming.entity';
import { WebhooksService } from './services/webhooks.service';
import { WebhookDispatcherService } from './services/webhook-dispatcher.service';
import { WebhookReceiverService } from './services/webhook-receiver.service';
import { WebhooksController } from './controllers/webhooks.controller';
import { WebhookReceiverController } from './controllers/webhook-receiver.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WebhookSubscription,
      WebhookDelivery,
      WebhookIncoming,
    ]),
    ConfigModule,
  ],
  controllers: [WebhooksController, WebhookReceiverController],
  providers: [
    WebhooksService,
    WebhookDispatcherService,
    WebhookReceiverService,
  ],
  exports: [WebhooksService, WebhookDispatcherService, WebhookReceiverService],
})
export class WebhooksModule {}
