import { Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage, MulterError } from 'multer';
import { CvsService } from './cvs.service';
import { FullFeedbackQueryDto } from './dto/full-feedback-query.dto';
import { appConfig } from '../../config/app.config';

@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: memoryStorage(),
      limits: {
        fileSize: appConfig.maxCvFileSize ? parseInt(appConfig.maxCvFileSize, 10) : 2 * 1024 * 1024,
      },
      fileFilter: (_req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
        }
      },
    }),
  )
  uploadCv(@UploadedFile() file: Express.Multer.File) {
    return this.cvsService.uploadCv(file);
  }

  @Post(':cvId/generate-feedback')
  generateFeedback(@Param('cvId') cvId: string) {
    return this.cvsService.generateFeedback(cvId);
  }

  @Get(':cvId/full-feedback')
  getFullFeedback(@Param('cvId') cvId: string, @Query() query: FullFeedbackQueryDto) {
    return this.cvsService.getFullFeedback(cvId, query);
  }

  @Get(':cvId')
  getCv(@Param('cvId') cvId: string) {
    return this.cvsService.getCv(cvId);
  }
}
