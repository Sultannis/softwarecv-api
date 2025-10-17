import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private s3Config;

  constructor(private readonly configService: ConfigService) {
    this.s3Config = this.configService.get('s3');

    this.s3Client = new S3Client({
      region: this.s3Config.region,
      endpoint: this.s3Config.endpoint,
      credentials: {
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
    });
  }

  async uploadPdfFile(fileBuffer: Buffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.s3Config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/pdf',
      ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);

    const url = `https://${this.s3Config.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${key}`;

    return {
      key,
      url,
      bucket: this.s3Config.bucketName,
    };
  }
}
