import { Body, Controller, Post } from '@nestjs/common';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { AiService } from './ai.service';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsArray()
  @IsOptional()
  history?: { role: string; text: string }[];
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    const { message, history } = chatDto;
    const response = await this.aiService.generateChatResponse(
      message,
      history,
    );
    return {
      success: true,
      data: response,
    };
  }
}
