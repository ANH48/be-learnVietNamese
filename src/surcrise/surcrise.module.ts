import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { SurcriseController } from './controller/surcrise.controller';
import { SurcriseEntity } from './models/surcrise.entity';
import { SurcriseService } from './service/surcrise.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SurcriseEntity]),
        AuthModule,
        // MailModule
    ] ,
    providers: [SurcriseService],
    controllers: [SurcriseController],
    exports: [SurcriseService]
})
export class SurcriseModule {}
