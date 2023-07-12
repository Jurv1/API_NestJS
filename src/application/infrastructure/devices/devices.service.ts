import { Injectable } from '@nestjs/common';
import { UserLoginDataDto } from '../../../api/_public/auth/dto/user-login-data.dto';
import { JwtService } from '@nestjs/jwt';
import { DevicesRepository } from './devices.repository';
import { Device } from '../../entities/devices/device.entity';
import { User } from '../../entities/users/user.entity';

@Injectable()
export class DevicesService {
  constructor(
    private readonly deviceRepository: DevicesRepository,
    private readonly jwtService: JwtService,
  ) {}
  async deleteAllDevicesExceptActive(userId: string, deviceId: string) {
    return await this.deviceRepository.deleteAllExceptActive(userId, deviceId);
  }

  async deleteOneDeviceById(deviceId: string) {
    return await this.deviceRepository.deleteOneDeviceById(deviceId);
  }

  async createNewDevice(
    userDto: UserLoginDataDto,
    refreshToken: any,
    user: User,
  ) {
    const decodedToken: any = await this.jwtService.decode(refreshToken);
    const newDevice: Device = new Device();
    newDevice.deviceId = decodedToken.deviceId;
    newDevice.ip = userDto.deviceIp;
    newDevice.title = userDto.device;
    newDevice.user = user;
    newDevice.LastActiveDate = new Date(decodedToken.iat * 1000);

    return await this.deviceRepository.createNewDevice(newDevice);
  }

  async updateDeviceIdAndIat(
    oldDeviceId: string,
    newDeviceId: string,
    newIat: number,
  ) {
    await this.deviceRepository.updateDevice(oldDeviceId, newDeviceId, newIat);
  }

  async updateDeviceIat(deviceId: string, iat: number): Promise<boolean> {
    return await this.deviceRepository.updateDeviceIat(deviceId, iat);
  }
}
