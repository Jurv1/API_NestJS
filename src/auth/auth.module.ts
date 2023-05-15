import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    MailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
