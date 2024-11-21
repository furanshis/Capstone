import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
const { getJson } = require("serpapi");

@Injectable()
export class ChatbotAdminService {
    private readonly apiKey = process.env.OPENAI_API_KEY;

    private readonly client = new OpenAI({ apiKey: this.apiKey });
    private readonly assistantId: string;
    private readonly maxFileSize = 20 * 1024 * 1024; // 20MB
    private readonly allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/json',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];


    constructor(private readonly configService: ConfigService) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.assistantId = process.env.ASSISTANT_ADMIN_ID;
    }

    private async getSearchResult(query: string) {
      try {
        console.log('Performing web search for:', query);
        const json = await getJson({
          engine: "google",
          api_key: this.configService.get<string>('SERPAPI_KEY'),
          q: query,
          location: "Chile",
        });
        return json["organic_results"];
      } catch (error) {
        console.error('Search error:', error);
        throw new HttpException(
          'Failed to perform web search',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async createThread(): Promise<string> {
      try {
        const thread = await this.client.beta.threads.create();
        return thread.id;
      } catch (error) {
        throw new HttpException(
          'Failed to create thread',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async initializeAssistantMessage(threadId: string, username: string): Promise<string> {
      try {
        const greeting = `Hola ${username}, soy tu asistente Admin. ¿En qué puedo ayudarte hoy? 😄`;
        await this.client.beta.threads.messages.create(threadId, {
          role: 'assistant',
          content: greeting,
        });
        return greeting;
      } catch (error) {
        throw new HttpException(
          'Failed to initialize assistant message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  

    async sendMessage(threadId: string, content: string, files?: Express.Multer.File[]): Promise<string> {
      try {
        let attachments: any[] = [];
        let contentItems: any[] = [];
  
        if (files && files.length > 0) {
          this.validateFiles(files);
          const { imageContentItems, fileAttachments } = await this.processFiles(files);
          contentItems = imageContentItems;
          attachments = fileAttachments;
        }
  
        const messageContent = contentItems.length > 0
          ? [{ type: 'text', text: content }, ...contentItems]
          : content;
  
        const messageData: any = {
          role: 'user',
          content: messageContent,
        };
  
        if (attachments.length > 0) {
          messageData.attachments = attachments;
        }
  
        await this.client.beta.threads.messages.create(threadId, messageData);
        const response = await this.processAssistantResponse(threadId);
        return response;
      } catch (error) {
        console.error('Error in sendMessage:', error);
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(
          'Failed to process message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    private validateFiles(files: Express.Multer.File[]): void {
      for (const file of files) {
        if (file.size > this.maxFileSize) {
          throw new HttpException(
            `File ${file.originalname} exceeds maximum size of 20MB`,
            HttpStatus.BAD_REQUEST,
          );
        }
  
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          throw new HttpException(
            `File type ${file.mimetype} is not allowed`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    private createFileObject(file: Express.Multer.File): File {
      return new File(
        [file.buffer],
        file.originalname,
        { type: file.mimetype }
      );
    }
  
    private async processFiles(files: Express.Multer.File[]) {
      try {
        const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
        const otherFiles = files.filter(file => !file.mimetype.startsWith('image/'));
  
        const imageContentItems = await Promise.all(
          imageFiles.map(async file => {
            const fileObject = this.createFileObject(file);
            const response = await this.client.files.create({
              file: fileObject,
              purpose: 'vision',
            });
            return {
              type: 'image_file',
              image_file: { file_id: response.id },
            };
          }),
        );
  
        const fileAttachments = await Promise.all(
          otherFiles.map(async file => {
            const fileObject = this.createFileObject(file);
            const response = await this.client.files.create({
              file: fileObject,
              purpose: 'assistants',
            });
            return {
              file_id: response.id,
              tools: this.determineFileTools(file.mimetype),
            };
          }),
        );
  
        return { imageContentItems, fileAttachments };
      } catch (error) {
        throw new HttpException(
          'Failed to process files',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    private determineFileTools(mimetype: string) {
      const spreadsheetTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];
  
      return spreadsheetTypes.includes(mimetype)
        ? [{ type: 'code_interpreter' }]
        : [{ type: 'file_search' }];
    }
  
    private async createThreadMessage(
      threadId: string,
      content: string,
      attachments?: any[],
      contentItems?: any[],
    ): Promise<void> {
      const messageContent = contentItems?.length
        ? [{ type: 'text', text: content }, ...contentItems]
        : content;
  
      await this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content: messageContent,
        ...(attachments?.length && { attachments }),
      });
    }
  
    private async processAssistantResponse(threadId: string): Promise<string> {
      const run = await this.client.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
      });
      console.log(run.id)
      console.log(run.status)
  
      const response = await this.waitForRunCompletion(threadId, run.id);
      return response;
    }
  
    private async waitForRunCompletion(threadId: string, runId: string): Promise<string> {
      const maxAttempts = 40;
      const delay = 1000;
  
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const run = await this.client.beta.threads.runs.retrieve(threadId, runId);

        
  
        if (run.status === 'completed') {
          console.log(run)
          return await this.getAssistantResponse(threadId, runId);
        }

        if (run.status === 'requires_action') {
          if (run.required_action?.type === 'submit_tool_outputs') {
            const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
            const outputs = await Promise.all(
              toolCalls.map(async (toolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const searchResults = await this.getSearchResult(args.query);
                return {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(searchResults),
                };
              })
            );

          await this.client.beta.threads.runs.submitToolOutputs(threadId, runId, {
            tool_outputs: outputs,
          });

          // Continue waiting for completion after submitting outputs
          continue;
        }
      }
  
        if (['failed', 'cancelled', 'expired'].includes(run.status)) {
          throw new HttpException(
            `Assistant run ${run.status}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
  
        await new Promise(resolve => setTimeout(resolve, delay));
      }
  
      throw new HttpException('Assistant run timed out', HttpStatus.REQUEST_TIMEOUT);
    }
  
    private async getAssistantResponse(threadId: string, runId: string): Promise<string> {
      const messages = await this.client.beta.threads.messages.list(threadId);
      
      // Filtrar los mensajes del asistente relacionados con el runId
      const assistantMessages = messages.data
          .filter(msg => msg.role === 'assistant' && msg.run_id === runId);
  
      // Procesar los contenidos de los mensajes y resolver las promesas
      const assistantContents = await Promise.all(
          assistantMessages.map(async (msg) => {
              return this.extractMessageContent(msg.content);
          })
      );
  
      // Unir los contenidos en un solo texto
      const assistantMessage = assistantContents.join('\n');
      
      return assistantMessage || 'No response from assistant';
  }
  
  
    private async extractMessageContent(content: OpenAI.Beta.Threads.Messages.MessageContent[]): Promise<string> {
      console.log('Content: ', content)
      const results = await Promise.all(
          content.map(async (item) => {
              console.log('Procesando item:', item)
              if (item?.type === 'text') return item.text.value;
              if (item?.type === 'image_file') {
                  try {
                    if (item?.type === 'image_file') {
                      // Generar un enlace al controlador para obtener la imagen
                      const imageUrl = `${process.env.BACKEND_URL}/chatbot-admin/file/${item.image_file.file_id}`;
                      return `<img src="${imageUrl}" alt="Imagen generada por el asistente" />`; // Etiqueta HTML para mostrar la imagen
                  }
                  } catch (error) {
                      console.error('Error al descargar la imagen:', error);
                      return '[Error al descargar la imagen]';
                  }
              }
              return '';
          })
      );
  
      return results
          .filter(Boolean)
          .join('\n')
          .replace(/【[^】]*】/g, '')
          .trim();
  }
  
  
    
    
  
    async deleteThread(threadId: string): Promise<void> {
      try {
        await this.client.beta.threads.del(threadId);
      } catch (error) {
        throw new HttpException(
          'Failed to delete thread',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    
    
    async obtenerArchivo(file_id: string): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
      const file = await this.client.files.content(file_id);
  
      // Convierte a buffer
      const buffer = Buffer.from(await file.arrayBuffer());
  
      return {
        buffer, // El archivo como Buffer
        mimeType: 'image/png', // Tipo MIME del archivo (ajústalo según corresponda)
        fileName: `${file_id}.png` // Nombre sugerido para el archivo
      };
    }
    
}
