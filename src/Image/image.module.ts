import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { UserModule } from 'src/user/user.module';
import { ImageEntity } from './image.entity';
import { ImageService } from './image.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageEntity]),
        AuthModule,
        UserModule
    ] ,
    providers: [ImageService],
    // controllers: [CourseController],
    exports: [ImageService]
})
export class ImageModule {}