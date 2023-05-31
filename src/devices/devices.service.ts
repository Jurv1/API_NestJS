import { Injectable } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { UserLoginDataDto } from '../auth/dto/user-login-data.dto';
import {
  Device,
  DeviceDocument,
  DeviceModelType,
} from './schemas/devices.database.schema';
import { JwtService } from '@nestjs/jwt';
import { DeviceCreateDto } from './dto/device-create.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DevicesService {
  constructor(
    private readonly deviceRepository: DevicesRepository,
    @InjectModel(Device.name) private readonly deviceModel: DeviceModelType,
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

    const device: DeviceDocument = await this.deviceModel.createDevice(
      deviceDto,
      this.deviceModel,
    );
    await device.save();
    return device;
  }
}
