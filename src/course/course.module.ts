import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { ImageModule } from 'src/Image/image.module';
import { UserModule } from 'src/user/user.module';
import { CourseController } from './controller/course.controller';
import { CourseEntity } from './models/course.entity';
import { CourseService } from './service/course.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CourseEntity]),
        AuthModule,
        UserModule,
        ImageModule
    ] ,
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService]
})
export class CourseModule {}
