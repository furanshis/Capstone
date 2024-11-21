import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotAdminService } from './chatbot-admin.service';

describe('ChatbotAdminService', () => {
  let service: ChatbotAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatbotAdminService],
    }).compile();

    service = module.get<ChatbotAdminService>(ChatbotAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
