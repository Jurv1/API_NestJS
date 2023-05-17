import { Injectable } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { UserLoginDataDto } from '../auth/dto/user-login-data.dto';

@Injectable()
export class DevicesService {
  constructor(protected deviceRepository: DevicesRepository) {}
  async deleteAllDevicesExceptActive(userId: string, deviceId: string) {
    return await this.deviceRepository.deleteAllExceptActive(userId, deviceId);
  }

  async deleteOneDeviceById(id: string) {
    return await this.deviceRepository.deleteOneDeviceById(id);
  }

  async createNewDevice(userDto: UserLoginDataDto, refreshToken: any) {
    const deviceTmp = {
      ip: userDto.deviceIp,
      title: userDto.device,
      lastActiveDate: new Date(refreshToken.iat * 1000).toISOString(),
      deviceId: refreshToken.deviceId,
      userId: userDto.userId,
    };
    await this.deviceRepository.createNewDevice(deviceTmp);
  }
}
