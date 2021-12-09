import { Test, TestingModule } from '@nestjs/testing';
import {SurcriseController } from './surcrise.controller';

describe('CourseController', () => {
  let controller: SurcriseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurcriseController],
    }).compile();

    controller = module.get<SurcriseController>(SurcriseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
