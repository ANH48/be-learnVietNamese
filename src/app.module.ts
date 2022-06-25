import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BlogTypeModule } from './blog-type/blog_type.module';
import { CourseModule } from './course/course.module';
import { LessionModule } from './lession/lession.module';
// import { MailModule } from './mail/mail.module';
import { MailModule } from './mail/mail.module';
import { SurcriseModule } from './subscribe/subscribe.module';
import { Lession_saveModule } from './lession-save/lession-save.module';
import { ImageModule } from './Image/image.module';
import { CourseTypeModule } from './course-type/course-type.module';
import { RegisterCourseModule } from './register-course/register-course.module';
import { CommentLessonModule } from './comment-lesson/comment-lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    // MailModule,
    UserModule,
    AuthModule,
    BlogModule,
    BlogTypeModule,
    CourseModule,
    CourseTypeModule,
    LessionModule,
    CommentLessonModule,
    MailModule,
    SurcriseModule,
    Lession_saveModule,
    ImageModule,
    SurcriseModule,
    RegisterCourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
