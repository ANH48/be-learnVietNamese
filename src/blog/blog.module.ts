import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogController } from './controller/blog.controller';
import { BlogEntity } from './models/blog.entity';
import { BlogService } from './service/blog.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity]),
        AuthModule,
        UserModule
    ] ,
    providers: [BlogService],
    controllers: [BlogController],
    exports: [BlogService]
})
export class BlogModule {}
