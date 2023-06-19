import { Module } from '@nestjs/common';
import { allDevicesUseCases } from './use-cases/all.devices.use-cases';
import { allReposForDevices } from './repositories/all.repos.for.devices';
import { JwtService } from '@nestjs/jwt';
import { PublicDeviceController } from '../_public/devices.public/devices.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Device,
  DeviceSchema,
} from '../../application/schemas/devices/schemas/devices.database.schema';
import { AuthService } from '../_public/auth/auth.service';
import { DeviceQ } from '../../application/infrastructure/devices/devices.query.repository';
import { UsersService } from '../../application/infrastructure/users/users.service';
import { MailService } from '../../application/mail/mail.service';
import {
  RefreshTokenBlacklist,
  RefreshTokenBlackListSchema,
} from '../../application/schemas/devices/schemas/refresh-token.blacklist';
import {
  User,
  UserSchema,
} from '../../application/schemas/users/schemas/users.database.schema';
import { DevicesService } from '../../application/infrastructure/devices/devices.service';
import { UsersRepository } from '../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../application/infrastructure/users/users.query.repository';
import { UserQ } from '../../application/infrastructure/users/_MongoDB/users.query.repository';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: RefreshTokenBlacklist.name, schema: RefreshTokenBlackListSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PublicDeviceController],
  providers: [
    ...allDevicesUseCases,
    ...allReposForDevices,
    JwtService,
    AuthService,
    UsersQueryRepository,
    UserQ,
    DeviceQ,
    DevicesService,
    UsersService,
    MailService,
    UsersRepository,
  ],
})
export class DevicesModule {}
