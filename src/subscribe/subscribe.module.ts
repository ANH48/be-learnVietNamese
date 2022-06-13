import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { SubscribeController } from './controller/subscribe.controller';
import { SubscribeEntity } from './models/subscribe.entity';
import { SubscribeService } from './service/subscribe.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubscribeEntity]),
        AuthModule,
        // MailModule
    ] ,
    providers: [SubscribeService],
    controllers: [SubscribeController],
    exports: [SubscribeService]
})
export class SurcriseModule {}
