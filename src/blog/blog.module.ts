import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { BlogController } from './controller/blog.controller';
import { BlogEntity } from './models/blog.entity';
import { BlogService } from './service/blog.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity]),
        AuthModule
    ] ,
    providers: [BlogService],
    controllers: [BlogController],
    exports: [BlogService]
})
export class BlogModule {}
