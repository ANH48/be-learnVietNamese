import { Test, TestingModule } from '@nestjs/testing';
import { QAndAController } from './feed.controller';

describe('QAndAController', () => {
  let controller: QAndAController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QAndAController],
    }).compile();

    controller = module.get<QAndAController>(QAndAController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
