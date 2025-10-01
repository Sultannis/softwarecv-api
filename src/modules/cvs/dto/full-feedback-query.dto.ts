import { IsString } from 'class-validator';

export class FullFeedbackQueryDto {
  @IsString()
  'transaction-id': string;

  get transactionId(): string {
    return this['transaction-id'];
  }
}

