import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from './user.entity';

@Entity('uploaded_resumes')
export class UploadedResume {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 's3_url', type: 'text' })
  s3Url: string;

  @Column({ name: 'claude_file_meta', type: 'jsonb' })
  claudeFileMeta: string;

  @Column({ name: 'feedback', type: 'text', nullable: true })
  feedback: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.uploadedResumes)
  user: User;
}
