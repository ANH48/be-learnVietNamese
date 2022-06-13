import { Module } from '@nestjs/common';
import { CourseTypeService } from './service/course-type.service';
import { CourseTypeController } from './controller/course-type.controller';
import { CourseTypeEntity } from './models/course-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseTypeEntity]),
    AuthModule,
    UserModule
  ],
  providers: [CourseTypeService],
  controllers: [CourseTypeController],
  exports: [CourseTypeService]
})
export class CourseTypeModule { }
