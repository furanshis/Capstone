import { Module } from '@nestjs/common';
import { ChatbotAdminService } from './chatbot-admin.service';
import { ChatbotAdminController } from './chatbot-admin.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ChatbotAdminService],
  controllers: [ChatbotAdminController]
})
export class ChatbotAdminModule {}
