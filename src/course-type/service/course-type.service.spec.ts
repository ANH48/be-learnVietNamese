import { Test, TestingModule } from '@nestjs/testing';
import { CourseTypeService } from './course-type.service';

describe('CourseTypeService', () => {
  let service: CourseTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseTypeService],
    }).compile();

    service = module.get<CourseTypeService>(CourseTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
