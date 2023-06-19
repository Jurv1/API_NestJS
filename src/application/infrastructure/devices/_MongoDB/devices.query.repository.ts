import { Injectable } from '@nestjs/common';
import {
  Device,
  DeviceModelType,
} from '../../../schemas/devices/schemas/devices.database.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DeviceQ {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: DeviceModelType,
  ) {}
  async getAllDevicesByUserId(userId: string) {
    return this.deviceModel.find({ userId: userId }).lean();
  }

  async getOneDeviceById(deviceId: string) {
    return this.deviceModel.findOne({ deviceId: deviceId });
  }
}
