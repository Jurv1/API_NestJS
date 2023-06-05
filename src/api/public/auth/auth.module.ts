import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../../../users/users.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { MailService } from '../../../mail/mail.service';
import { MailModule } from '../../../mail/mail.module';
import { jwtConstants } from '../../../config/consts';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenBlacklist,
  RefreshTokenBlackListSchema,
} from '../../../devices/schemas/refresh-token.blacklist';

console.log(process.env.SECRET);
@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.jwtSecret,
      signOptions: {
        expiresIn: jwtConstants.tokenTime5m,
      },
    }),
    MailModule,
    MongooseModule.forFeature([
      { name: RefreshTokenBlacklist.name, schema: RefreshTokenBlackListSchema },
    ]),
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
