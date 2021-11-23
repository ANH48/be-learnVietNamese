import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogTypeController } from './controller/blog_type.controller';
import { BlogTypeEntity } from './models/blog_type.entity';
import { BlogTypeService } from './service/blog_type.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogTypeEntity]),
        AuthModule,
        UserModule
    ] ,
    providers: [BlogTypeService],
    controllers: [BlogTypeController],
    exports: [BlogTypeService]
})
export class BlogTypeModule {}
