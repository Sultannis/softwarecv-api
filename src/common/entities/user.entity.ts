import { Entity, Column, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { UploadedResume } from './uploaded-resume.entity';

@Entity('users')
export class User {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
  })
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({
    name: 'first_name',
    type: 'varchar',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
  })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  password?: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: 'now()',
  })
  createdAt: string;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: 'now()',
  })
  updatedAt: string;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: string;

  @OneToMany(() => UploadedResume, (uploadedResume) => uploadedResume.user)
  uploadedResumes: UploadedResume[];
}
