import { Test, TestingModule } from '@nestjs/testing';
import { CourseTypeController } from './course-type.controller';

describe('CourseTypeController', () => {
  let controller: CourseTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseTypeController],
    }).compile();

    controller = module.get<CourseTypeController>(CourseTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
