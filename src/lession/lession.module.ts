import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { LessionController } from './controller/lession.controller';
import { LessionEntity } from './models/lession.entity';
import { LessionService } from './service/lession.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LessionEntity]),
        AuthModule
    ] ,
    providers: [LessionService],
    controllers: [LessionController],
    exports: [LessionService]
})
export class LessionModule {}