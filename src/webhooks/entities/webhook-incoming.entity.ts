import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('webhook_incoming')
export class WebhookIncoming {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  headers: Record<string, string>;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  processingStatus: string;

  @Column({ type: 'text', nullable: true })
  processingError: string;

  @Column({ type: 'boolean', default: false })
  signatureValid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
