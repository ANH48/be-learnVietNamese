import { Module } from '@nestjs/common';
import { CommentLessonService } from './service/comment-lesson.service';
import { CommentLessonController } from './controller/comment-lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLessonEntity } from './models/comment-lesson.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentLessonEntity]),
        AuthModule,
        UserModule
      ],
  providers: [CommentLessonService],
  controllers: [CommentLessonController]
})
export class CommentLessonModule {}
