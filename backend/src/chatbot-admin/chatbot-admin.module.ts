import { Module } from '@nestjs/common';
import { ChatbotAdminService } from './chatbot-admin.service';
import { ChatbotAdminController } from './chatbot-admin.controller';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from '../openai/openai.service';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [ConfigModule, OpenaiModule],
  providers: [ChatbotAdminService, OpenaiService],
  controllers: [ChatbotAdminController]
})
export class ChatbotAdminModule {}
