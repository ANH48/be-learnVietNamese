import { Test, TestingModule } from '@nestjs/testing';
import { RegisterCourseController } from './register-course.controller';

describe('RegisterCourseController', () => {
  let controller: RegisterCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterCourseController],
    }).compile();

    controller = module.get<RegisterCourseController>(RegisterCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
