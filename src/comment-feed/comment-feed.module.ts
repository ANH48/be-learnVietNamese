import { Module } from '@nestjs/common';
import { CommentFeedService } from './service/comment-feed.service';
import { CommentFeedController } from './controller/comment-feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedEntity } from 'src/q-and-a/models/feed.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CommentFeedEntity } from './models/comment-feed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentFeedEntity]),
    AuthModule,
    UserModule,
    FeedEntity
  ],
  providers: [CommentFeedService],
  controllers: [CommentFeedController],
  exports: [CommentFeedService]
})
export class CommentFeedModule {}
