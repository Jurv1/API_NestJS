import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../../../application/infrastructure/users/users.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { MailService } from '../../../mail/mail.service';
import { MailModule } from '../../../mail/mail.module';
import { jwtConstants } from '../../../application/config/consts';
import { ThrottlerModule } from '@nestjs/throttler';
import { PublicAuthController } from './auth.controller';
import { DevicesService } from '../../../application/infrastructure/devices/devices.service';
import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { DevicesQueryRepository } from '../../../application/infrastructure/devices/devices.query.repository';

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.jwtSecret,
      signOptions: {
        expiresIn: jwtConstants.tokenTime5m,
      },
    }),
    MailModule,
  ],
  controllers: [PublicAuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    MailService,
    UsersQueryRepository,
    UsersRepository,
    DevicesQueryRepository,
    DevicesService,
    DevicesRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
