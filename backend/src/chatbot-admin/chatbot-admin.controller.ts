import {
    Controller,
    Post,
    Get,
    Body,
    Delete,
    Res,
    Param,
    UseInterceptors,
    UploadedFiles,
  } from '@nestjs/common';
  import { ChatbotAdminService } from './chatbot-admin.service';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { InitializeMessageDto, SendMessageDto } from './dto/chat-admin.dto';

@Controller('chatbot-admin')
export class ChatbotAdminController {
  constructor(private readonly chatbotAdminService: ChatbotAdminService) {}

  @Post('thread/create')
    async createThread() {
    return await this.chatbotAdminService.createThread();
    }

    @Post('thread/:threadId/initialize')
    async initializeMessage(
        @Param('threadId') threadId: string,
        @Body() dto: InitializeMessageDto,
    ) {
        return await this.chatbotAdminService.initializeAssistantMessage(threadId, dto.username);
    }

    @Post('thread/:threadId/message')
    @UseInterceptors(FilesInterceptor('files'))
    async sendMessage(
        @Param('threadId') threadId: string,
        @Body() dto: SendMessageDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return await this.chatbotAdminService.sendMessage(threadId, dto.content, files);
    }

    @Delete('thread/:threadId/delete')
    async deleteThread(@Param('threadId') threadId: string) {
        return await this.chatbotAdminService.deleteThread(threadId);
    }

    @Get('file/:file_id')
    async obtenerArchivo(@Param('file_id') file_id: string, @Res() res: Response) {
        const { buffer, mimeType, fileName } = await this.chatbotAdminService.obtenerArchivo(file_id);
    
        // Configura los encabezados de la respuesta
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename=${fileName}`);
    
        // Envía el archivo al cliente
        res.send(buffer);
      }
    
}
