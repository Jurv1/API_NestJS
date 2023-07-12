import { Module } from '@nestjs/common';
import { allDevicesUseCases } from './use-cases/all.devices.use-cases';
import { allReposForDevices } from './repositories/all.repos.for.devices';
import { JwtService } from '@nestjs/jwt';
import { PublicDeviceController } from '../_public/devices.public/devices.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthService } from '../_public/auth/auth.service';
import { UsersService } from '../../application/infrastructure/users/users.service';
import { MailService } from '../../mail/mail.service';
import { DevicesService } from '../../application/infrastructure/devices/devices.service';
import { UsersRepository } from '../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../application/infrastructure/users/users.query.repository';
import { DeviceMapper } from '../../application/utils/mappers/device.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../application/entities/devices/device.entity';
import { User } from '../../application/entities/users/user.entity';
import { EmailConfirmationForUsers } from '../../application/entities/users/email.confirmation.for.users.entity';
import { BansForUserByAdmin } from '../../application/entities/users/bans.for.user.by.admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      User,
      EmailConfirmationForUsers,
      BansForUserByAdmin,
    ]),
    CqrsModule,
  ],
  controllers: [PublicDeviceController],
  providers: [
    ...allDevicesUseCases,
    ...allReposForDevices,
    JwtService,
    AuthService,
    UsersQueryRepository,
    DevicesService,
    DeviceMapper,
    UsersService,
    MailService,
    UsersRepository,
  ],
})
export class DevicesModule {}
