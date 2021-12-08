import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModule } from 'src/Image/image.module';
import { Lession_saveModule } from 'src/lession-save/lession-save.module';
import { UserModule } from 'src/user/user.module';
import { BlogController } from './controller/blog.controller';
import { BlogEntity } from './models/blog.entity';
import { BlogService } from './service/blog.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity]),
        AuthModule,
        UserModule,
        Lession_saveModule,
        ImageModule
    ] ,
    providers: [BlogService],
    controllers: [BlogController],
    exports: [BlogService]
})
export class BlogModule {}
