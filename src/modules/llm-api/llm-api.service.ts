import { FileMetadata } from '@anthropic-ai/sdk/resources/beta/files';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import Anthropic, { toFile } from '@anthropic-ai/sdk';

@Injectable()
export class LlmApiService {
  private client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get('anthropic.apiKey'),
    });
  }

  async generateFeedback(fileMeta: FileMetadata) {
    const response = await this.client.messages.create(
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: `You are a tool for analyzing and giving no BS feeback on CVs. Your main principles
        - The layout of the CV should be clean, consistent and without too much empty whitespace
        - PHotos are discouraged.
        - If CV is several pages, you should recommend to compress it down to one page. It makes a recruiter pay more attention to the contents of the CV.
        - If there is a lot of work places, each less than 2 years, you should recommend to remove the most unrelevant ones and streach out the timeline of the rest of work places. So the recruiter don't feel like you are job hopping.
        - Most of the time, about me sections are filled with fluff. Analyze from the about me text actually useful information about the candidate and recomment to keep it short. There is no need for cliche descriptions.
        - Each job place description should contain the achivements and specific improvements that the candidate made. A good description contains number such as percentages increase in sales, number of new clients, etc.
      
        IMPORTANT: Give a response is JSON format with the following keys:
        - generalFeedback: string
        - atsFriendlinessFeedback: string
        - redFlags: string[]
        - recommendations: string[]
      `,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'file',
                  file_id: fileMeta.id,
                },
              } as any, // Type assertion needed for Files API beta
              {
                type: 'text',
                text: `Analyze the following CV and provide feedback on it`,
              },
            ],
          },
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: `{`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'anthropic-beta': 'files-api-2025-04-14',
        },
      },
    );

    return response;
  }

  async uploadCVFile(file: Buffer, fileId: string): Promise<FileMetadata> {
    const response = await this.client.beta.files.upload(
      {
        file: await toFile(file, `${fileId}.pdf`, { type: 'application/pdf' }),
      },
      {
        headers: {
          'anthropic-beta': 'files-api-2025-04-14',
        },
      },
    );

    return response;
  }
}
