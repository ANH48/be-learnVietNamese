import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Lession_saveController } from './controller/lession-save.controller';
import { Lession_saveEntity } from './models/lession-save.entity';
import { Lession_saveService } from './service/lession-save.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lession_saveEntity]),
        AuthModule,
        UserModule
    ] ,
    providers: [Lession_saveService],
    controllers: [Lession_saveController],
    exports: [Lession_saveService]
})
export class Lession_saveModule {}
