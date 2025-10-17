import { Module } from '@nestjs/common';
import { LlmApiService } from './llm-api.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LlmApiService],
  exports: [LlmApiService],
})
export class LlmApiModule {}
