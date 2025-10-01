import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('cvs')
export class Cv {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 's3_url', type: 'text' })
  s3Url: string;

  @Column({
    name: 'claude_file_meta',
    type: 'jsonb',
    nullable: false,
  })
  claudeFileMeta: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  feedback?: string | null;

  @Column({ name: 'transaction_id', type: 'varchar', nullable: true })
  transactionId?: string | null;

  @Column({
    name: 'paddle_transaction',
    type: 'jsonb',
    nullable: true,
  })
  paddleTransaction?: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;
}
