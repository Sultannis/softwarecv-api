import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { RequestUser } from './modules/auth/entities/request-user.entity';

declare module 'express' {
  interface Request {
    user?: RequestUser;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: JSON.parse(process.env.CORS_HOSTS || '[]'), credentials: true },
  });

  app.use(cookieParser());

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}
bootstrap();
