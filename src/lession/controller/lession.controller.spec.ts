import { Test, TestingModule } from '@nestjs/testing';
import {LessionController } from './lession.controller';

describe('LessionController', () => {
  let controller: LessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessionController],
    }).compile();

    controller = module.get<LessionController>(LessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
