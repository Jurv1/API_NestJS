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
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../application/entities/users/user.entity';
import { Device } from '../../../application/entities/devices/device.entity';
import { EmailConfirmationForUsers } from '../../../application/entities/users/email.confirmation.for.users.entity';
import { PasswordRecoveryForUsers } from '../../../application/entities/users/password.recovery.for.users.entity';
import { BansForUserByAdmin } from '../../../application/entities/users/bans.for.user.by.admin.entity';
import { IsLoginExistsProv } from '../../../application/utils/custom.validation.decorators/is.login.exists';
import { IsEmailExistsProv } from '../../../application/utils/custom.validation.decorators/is.email.exists';

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    TypeOrmModule.forFeature([
      User,
      EmailConfirmationForUsers,
      PasswordRecoveryForUsers,
      BansForUserByAdmin,
      Device,
    ]),
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
    IsLoginExistsProv,
    IsEmailExistsProv,
  ],
  exports: [AuthService],
})
export class AuthModule {}
