import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserDecodeInterceptor } from './modules/auth/interceptors/user-decode.interceptor';
import { configList } from './config';

import { User } from './common/entities/user.entity';
import { UploadedResume } from './common/entities/uploaded-resume.entity';

import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { ResumesModule } from './modules/resumes/resumes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configList,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const appConfig = configService.get('app');
        const databaseConfig = configService.get('database');

        return {
          ...databaseConfig,
          entities: [User, UploadedResume],
          database: databaseConfig.database,
          ssl:
            appConfig.appEnv === 'local'
              ? false
              : {
                  ca: process.env.CACERT,
                },
        };
      },
    }),
    JwtModule.register({
      global: true,
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    ResumesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserDecodeInterceptor,
    },
  ],
})
export class AppModule {}
