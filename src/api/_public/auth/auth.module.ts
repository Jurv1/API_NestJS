import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../../../application/infrastructure/users/users.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { MailService } from '../../../application/mail/mail.service';
import { MailModule } from '../../../application/mail/mail.module';
import { jwtConstants } from '../../../application/config/consts';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenBlacklist,
  RefreshTokenBlackListSchema,
} from '../../../application/schemas/devices/schemas/refresh-token.blacklist';
import { UserQ } from '../../../application/infrastructure/users/users.query.repository';
import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import {
  User,
  UserSchema,
} from '../../../application/schemas/users/schemas/users.database.schema';
import { PublicAuthController } from './auth.controller';
import { DeviceQ } from '../../../application/infrastructure/devices/devices.query.repository';
import {
  Device,
  DeviceSchema,
} from '../../../application/schemas/devices/schemas/devices.database.schema';
import { DevicesService } from '../../../application/infrastructure/devices/devices.service';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';

console.log(process.env.SECRET);
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
    MongooseModule.forFeature([
      { name: RefreshTokenBlacklist.name, schema: RefreshTokenBlackListSchema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [PublicAuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    MailService,
    UserQ,
    UsersRepository,
    DeviceQ,
    DevicesService,
    DevicesRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
