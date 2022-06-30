import { Test, TestingModule } from '@nestjs/testing';
import { QAndAService } from './feed.service';

describe('QAndAService', () => {
  let service: QAndAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QAndAService],
    }).compile();

    service = module.get<QAndAService>(QAndAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
