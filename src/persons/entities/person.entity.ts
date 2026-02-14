import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

@Entity('persons')
export class Person extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  surname: string;
}
