import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from '../../common/entities/cv.entity';
import { CvStorageService } from './services/cv-storage.service';
import { CvFeedbackService } from './services/cv-feedback.service';
import { CvPaymentService } from './services/cv-payment.service';
import { FullFeedbackQueryDto } from './dto/full-feedback-query.dto';
import { UploadCvResponseDto } from './dto/upload-cv-response.dto';

@Injectable()
export class CvsService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvsRepository: Repository<Cv>,
    private readonly cvStorageService: CvStorageService,
    private readonly cvFeedbackService: CvFeedbackService,
    private readonly cvPaymentService: CvPaymentService,
  ) {}

  async uploadCv(file: Express.Multer.File): Promise<UploadCvResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { fileId, s3Url, claudeFileMeta } = await this.cvStorageService.uploadCv(file);

    const entity = this.cvsRepository.create({
      id: fileId,
      s3Url,
      claudeFileMeta,
    });

    try {
      await this.cvsRepository.save(entity);
    } catch (error) {
      throw new InternalServerErrorException('Error saving feedback');
    }

    return { data: { id: entity.id } };
  }

  async generateFeedback(cvId: string) {
    if (!cvId) {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.cvsRepository.findOne({ where: { id: cvId } });

    if (!cv) {
      throw new NotFoundException('CV record not found');
    }

    if (cv.feedback) {
      return {
        responseCut: `The layout of the CV${cv.feedback.slice(0, Math.ceil(cv.feedback.length * 0.5))}`,
      };
    }

    const feedback = await this.cvFeedbackService.generateFeedback(cv.claudeFileMeta);

    await this.cvsRepository.update(cvId, { feedback });

    return {
      responseCut: `The layout of the CV${feedback.slice(0, Math.ceil(feedback.length * 0.5))}`,
    };
  }

  async getFullFeedback(cvId: string, query: FullFeedbackQueryDto) {
    const { transactionId } = query;

    if (!transactionId) {
      throw new BadRequestException('Transaction ID is required');
    }

    if (!cvId) {
      throw new BadRequestException('CV ID is required');
    }

    const cvWithTransaction = await this.cvsRepository.findOne({
      where: { transactionId },
    });

    if (cvWithTransaction && cvWithTransaction.id !== cvId) {
      throw new BadRequestException('CV ID does not match');
    }

    if (cvWithTransaction) {
      return {
        data: {
          fullFeedback: `The layout of the CV${cvWithTransaction.feedback ?? ''}`,
        },
      };
    }

    const paymentTransaction = await this.cvPaymentService.getCheckout(transactionId) as any;

    if (!paymentTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (paymentTransaction.status !== 'succeeded') {
      throw new BadRequestException('Transaction not completed');
    }

    await this.cvsRepository.update(cvId, {
      transactionId: paymentTransaction.id,
      paddleTransaction: paymentTransaction,
    });

    const cv = await this.cvsRepository.findOne({ where: { id: cvId } });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return {
      data: {
        fullFeedback: `The layout of the CV${cv.feedback ?? ''}`,
      },
    };
  }

  async getCv(cvId: string) {
    if (!cvId) {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.cvsRepository.findOne({ where: { id: cvId } });

    if (!cv) {
      throw new NotFoundException('CV record not found');
    }

    return { data: cv };
  }
}
