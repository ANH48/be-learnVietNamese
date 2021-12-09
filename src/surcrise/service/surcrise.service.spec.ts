import { Test, TestingModule } from '@nestjs/testing';
import { SurcriseService } from './surcrise.service';

describe('CourseService', () => {
  let service: SurcriseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurcriseService],
    }).compile();

    service = module.get<SurcriseService>(SurcriseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
