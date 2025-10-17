import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  appEnv: process.env.APP_ENV,
}));
