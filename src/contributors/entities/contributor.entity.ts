import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

@Entity('contributors')
export class Contributor extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  surname: string;
}
