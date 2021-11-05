import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { CourseController } from './controller/course.controller';
import { CourseEntity } from './models/course.entity';
import { CourseService } from './service/course.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CourseEntity]),
        AuthModule
    ] ,
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService]
})
export class CourseModule {}
