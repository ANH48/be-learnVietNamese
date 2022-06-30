import { Test, TestingModule } from '@nestjs/testing';
import { CommentFeedController } from './comment-feed.controller';

describe('CommentFeedController', () => {
  let controller: CommentFeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentFeedController],
    }).compile();

    controller = module.get<CommentFeedController>(CommentFeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
