import { config } from 'dotenv';
config();

export const appConfig = {
  appEnv: process.env.APP_ENV,
  jwtSecret: process.env.JWT_SECRET,

  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'postgres',

  caCert: process.env.CACERT,

  clientDomain: process.env.CLIENT_DOMAIN,

  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  polar: {
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    serverURL: process.env.POLAR_SERVER_URL,
    successUrl: process.env.POLAR_SUCCESS_URL,
    productId: process.env.POLAR_PRODUCT_ID,
  },

  maxCvFileSize: process.env.MAX_FILE_SIZE,

  tokenCookieMaxAge: 1000 * 60 * 60 * 12 * 365,

  refreshTokenExpirationTime: '30d',
  accessTokenExpirationTime: '20s',
};
