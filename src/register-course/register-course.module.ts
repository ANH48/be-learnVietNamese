import { Module } from '@nestjs/common';
import { RegisterCourseService } from './service/register-course.service';
import { RegisterCourseController } from './controller/register-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCourseEntity } from './models/register-course.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserService} from 'src/user/service/user.service';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisterCourseEntity]),
    AuthModule,
    UserModule
  ],
  providers: [RegisterCourseService],
  controllers: [RegisterCourseController]
})
export class RegisterCourseModule {}
