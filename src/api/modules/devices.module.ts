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

@Module({
  imports: [TypeOrmModule.forFeature([Device]), CqrsModule],
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
