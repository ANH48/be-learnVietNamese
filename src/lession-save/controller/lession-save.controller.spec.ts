import { Test, TestingModule } from '@nestjs/testing';
import {Lession_saveController } from './lession-save.controller';

describe('Lession_saveController', () => {
  let controller: Lession_saveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Lession_saveController],
    }).compile();

    controller = module.get<Lession_saveController>(Lession_saveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
