import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('merchant_settings')
@Index('idx_merchant_settings_merchant_id', ['merchantId'], { unique: true })
export class MerchantSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  merchantId: string;

  @Column({ default: true })
  remindersEnabled: boolean = true;

  @Column('int', { array: true, default: [-3, 0, 7] })
  reminderOffsets: number[] = [-3, 0, 7];

  /** IANA timezone used for analytics bucketing, e.g. "America/Sao_Paulo". */
  @Column({ type: 'varchar', length: 64, default: 'UTC' })
  timezone: string = 'UTC';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}