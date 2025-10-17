import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 0,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  type: process.env.DB_TYPE || 'postgres',
}));
