import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './service/feed.service';
import { FeedController } from './controller/feed.controller';
import { FeedEntity } from './models/feed.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
    AuthModule,
    UserModule
  ],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [FeedService]
})
export class FeedModule {}
