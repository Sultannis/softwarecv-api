import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '../../../config/app.config';
import Anthropic, { toFile } from '@anthropic-ai/sdk';

@Injectable()
export class CvStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly anthropic: Anthropic;

  constructor() {
    this.bucketName = appConfig.s3.bucketName as string;
    this.s3Client = new S3Client({
      forcePathStyle: false,
      endpoint: appConfig.s3.endpoint,
      region: appConfig.s3.region,
      credentials: {
        accessKeyId: appConfig.s3.accessKeyId as string,
        secretAccessKey: appConfig.s3.secretAccessKey as string,
      },
    });
    this.anthropic = new Anthropic({
      apiKey: appConfig.anthropic.apiKey,
    });
  }

  async uploadCv(file: Express.Multer.File) {
    const allowedTypes = ['application/pdf'];
    const maxFileSize = appConfig.maxCvFileSize ? parseInt(appConfig.maxCvFileSize, 10) : 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF files are allowed.');
    }

    if (file.size > maxFileSize) {
      throw new BadRequestException('File size exceeds the maximum allowed size.');
    }

    const fileId = uuidv4();
    const key = `cvs/${fileId}.pdf`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: 'application/pdf',
          ServerSideEncryption: 'AES256',
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    const url = `https://${this.bucketName}.s3.${appConfig.s3.region}.amazonaws.com/${key}`;

    return {
      fileId,
      s3Url: url,
      claudeFileMeta: await this.uploadToClaude(file.buffer, fileId),
    };
  }

  private async uploadToClaude(file: Buffer, fileId: string) {
    try {
      const response = await this.anthropic.beta.files.upload(
        {
          file: await toFile(file, `${fileId}.pdf`, {
            type: 'application/pdf',
          }),
        },
        {
          headers: {
            'anthropic-beta': 'files-api-2025-04-14',
          },
        },
      );

      return response;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to Anthropic');
    }
  }
}
