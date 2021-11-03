import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { BlogTypeController } from './controller/blog_type.controller';
import { BlogTypeEntity } from './models/blog_type.entity';
import { BlogTypeService } from './service/blog_type.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogTypeEntity]),
        AuthModule
    ] ,
    providers: [BlogTypeService],
    controllers: [BlogTypeController],
    exports: [BlogTypeService]
})
export class BlogTypeModule {}
