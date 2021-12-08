import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { ImageModule } from 'src/Image/image.module';
import { Lession_saveModule } from 'src/lession-save/lession-save.module';
import { UserModule } from 'src/user/user.module';
import { LessionController } from './controller/lession.controller';
import { LessionEntity } from './models/lession.entity';
import { LessionService } from './service/lession.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LessionEntity]),
        AuthModule,
        UserModule,
        Lession_saveModule,
        ImageModule
    ] ,
    providers: [LessionService],
    controllers: [LessionController],
    exports: [LessionService]
})
export class LessionModule {}
