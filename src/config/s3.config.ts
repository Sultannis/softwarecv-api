import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  bucketName: process.env.S3_BUCKET_NAME,
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));
