import { Test, TestingModule } from '@nestjs/testing';
import { CommentFeedService } from './comment-feed.service';

describe('CommentFeedService', () => {
  let service: CommentFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentFeedService],
    }).compile();

    service = module.get<CommentFeedService>(CommentFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
