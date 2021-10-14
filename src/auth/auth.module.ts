import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    // AuthService
    // JwtModule.registerAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => ({
      //   secret: configService.get('jwt78772adasdasas0099'),
      //   signOptions: {expiresIn: '100s'}
      // })
      JwtModule.register({
        secret: 'jwt78772adasdasas0099',
        signOptions: { expiresIn: '60s' },
      }),
    // })
  ],
  providers: [AuthService],
  exports: [AuthService]
})

export class AuthModule {
}
