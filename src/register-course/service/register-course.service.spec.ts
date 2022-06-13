import { Test, TestingModule } from '@nestjs/testing';
import { RegisterCourseService } from './register-course.service';

describe('RegisterCourseService', () => {
  let service: RegisterCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterCourseService],
    }).compile();

    service = module.get<RegisterCourseService>(RegisterCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
