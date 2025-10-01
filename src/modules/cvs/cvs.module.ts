import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from '../../common/entities/cv.entity';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { CvStorageService } from './services/cv-storage.service';
import { CvFeedbackService } from './services/cv-feedback.service';
import { CvPaymentService } from './services/cv-payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])],
  controllers: [CvsController],
  providers: [CvsService, CvStorageService, CvFeedbackService, CvPaymentService],
  exports: [CvsService],
})
export class CvsModule {}
