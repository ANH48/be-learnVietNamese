import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guards';
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
      forwardRef(()=> UserModule),
      JwtModule.register({
        secret: 'jwt78772adasdasas0099',
        signOptions: { expiresIn: '300s' },
      }),
    // })
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService]
})

export class AuthModule {
}
