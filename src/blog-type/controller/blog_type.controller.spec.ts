import { Test, TestingModule } from '@nestjs/testing';
import {BlogTypeController } from './blog_type.controller';

describe('BlogController', () => {
  let controller: BlogTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogTypeController],
    }).compile();

    controller = module.get<BlogTypeController>(BlogTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
