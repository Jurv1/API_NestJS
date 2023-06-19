import { Injectable } from '@nestjs/common';
import { UserLoginDataDto } from '../../../api/_public/auth/dto/user-login-data.dto';
import { JwtService } from '@nestjs/jwt';
import { DeviceCreateDto } from '../../dto/devices/dto/device-create.dto';
import { DevicesRepository } from './devices.repository';

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
    //const decodedRefresh: any = await this.jwtService.decode(token);
    return await this.deviceRepository.deleteOneDeviceById(deviceId);
  }

  async createNewDevice(userDto: UserLoginDataDto, refreshToken: any) {
    const decodedToken: any = await this.jwtService.decode(refreshToken);
    const deviceDto: DeviceCreateDto = {
      ip: userDto.deviceIp,
      title: userDto.device,
      lastActiveDate: new Date(decodedToken.iat * 1000).toISOString(),
      deviceId: decodedToken.deviceId,
      userId: userDto.userId,
    };

    return await this.deviceRepository.createNewDevice(deviceDto);
  }

  async updateDeviceIdAndIat(
    oldDeviceId: string,
    newDeviceId: string,
    newIat: number,
  ) {
    await this.deviceRepository.updateDevice(oldDeviceId, newDeviceId, newIat);
  }
}
