import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotAdminController } from './chatbot-admin.controller';

describe('ChatbotAdminController', () => {
  let controller: ChatbotAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotAdminController],
    }).compile();

    controller = module.get<ChatbotAdminController>(ChatbotAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
