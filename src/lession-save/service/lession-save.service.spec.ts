import { Test, TestingModule } from '@nestjs/testing';
import { Lession_saveService } from './lession-save.service';

describe('Lession_saveService', () => {
  let service: Lession_saveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Lession_saveService],
    }).compile();

    service = module.get<Lession_saveService>(Lession_saveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
