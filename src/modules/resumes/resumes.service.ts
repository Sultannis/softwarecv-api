import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UploadedResume } from '../../common/entities/uploaded-resume.entity';
import { v7 as uuidv7 } from 'uuid';
import { S3Service } from '../s3/s3.service';
import { LlmApiService } from '../llm-api/llm-api.service';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(UploadedResume)
    private readonly resumesRepository: Repository<UploadedResume>,
    private readonly s3Service: S3Service,
    private readonly llmApiService: LlmApiService,
  ) {}

  async uploadResume(file: Express.Multer.File, userId: string) {
    const fileId = uuidv7();
    const fileBuffer = file.buffer;

    const [s3Result, claudeFileMeta] = await Promise.all([
      this.s3Service.uploadPdfFile(fileBuffer, `resumes/${fileId}.pdf`),
      this.llmApiService.uploadCVFile(fileBuffer, fileId),
    ]);

    const record = this.resumesRepository.create({
      userId,
      s3Url: s3Result.url,
      claudeFileMeta: JSON.stringify(claudeFileMeta),
    });

    await this.resumesRepository.save(record);

    return record;
  }

  async generateFeedback(resumeId: string, userId: string) {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId, userId } });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const feedback = await this.llmApiService
      .generateFeedback(JSON.parse(resume.claudeFileMeta))
      .then((feedback) => '{' + (feedback.content[0] as any).text);

    await this.resumesRepository.update(resumeId, { feedback });

    return JSON.parse(feedback);
  }
}
