import {
  Controller,
  UploadedFile,
  Post,
  Req,
  BadRequestException,
  UseGuards,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as multer from 'multer';

import { ResumesService } from './resumes.service';
import { UserGuard } from '../auth/guards/user.guard';

@Controller('resumes')
@UseInterceptors(
  FileInterceptor('resume', {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type. Only PDF files are allowed.'), false);
      }
    },
  }),
)
@UseGuards(UserGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('/upload')
  async uploadResume(@Req() req: Request, @UploadedFile() resumeFile: Express.Multer.File) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not found');
    }

    const uploadedResume = await this.resumesService.uploadResume(resumeFile, req.user.id);

    return uploadedResume;
  }

  @Post('/:resumeId/generate-feedback')
  async generateFeedback(@Req() req: Request, @Param('resumeId') resumeId: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not found');
    }

    const feedback = await this.resumesService.generateFeedback(resumeId, req.user.id);

    return {
      feedback,
    };
  }
}
