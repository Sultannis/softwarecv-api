import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { appConfig } from '../../../config/app.config';

@Injectable()
export class CvFeedbackService {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: appConfig.anthropic.apiKey,
    });
  }

  async generateFeedback(fileMeta: Record<string, any>): Promise<string> {
    const response = await this.client.messages.create(
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: `You are a tool for analyzing and giving no BS feeback on CVs. Your main principles
          - The layout of the CV should be clean, consistent and without too much empty whitespace
          - CV should'nt have a photo. It's a standard in any industry.
          - If CV is several pages, you should recommend to compress it down to one page. It makes a recruiter pay more attention to the contents of the CV.
          - If there is a lot of work places, each less than 2 years, you should recommend to remove the most unrelevant ones and streach out the timeline of the rest of work places. So the recruiter don't feel like you are job hopping.
          - Most of the time, about me sections are filled with fluff. Analyze from the about me text actually useful information about the candidate and recomment to keep it short. There is no need for cliche descriptions.
          - Each job place description should contain the achivements and specific improvements that the candidate made. A good description contains number such as percentages increase in sales, number of new clients, etc.
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
              } as any,
              {
                type: 'text',
                text: 'Analyze the following CV and provide feedback on it',
              },
            ],
          },
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: 'The layout of the CV',
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

    const firstContent = response.content[0];

    if (!firstContent || firstContent.type !== 'text') {
      throw new InternalServerErrorException('Unexpected response from Anthropic');
    }

    return firstContent.text;
  }
}
