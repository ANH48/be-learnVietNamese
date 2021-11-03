import { Test, TestingModule } from '@nestjs/testing';
import { BlogTypeService } from './blog_type.service';

describe('BlogService', () => {
  let service: BlogTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogTypeService],
    }).compile();

    service = module.get<BlogTypeService>(BlogTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
