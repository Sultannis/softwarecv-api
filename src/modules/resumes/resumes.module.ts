import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedResume } from '../../common/entities/uploaded-resume.entity';
import { S3Module } from '../s3/s3.module';
import { LlmApiModule } from '../llm-api/llm-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedResume]), S3Module, LlmApiModule],
  providers: [ResumesService],
  controllers: [ResumesController],
})
export class ResumesModule {}
