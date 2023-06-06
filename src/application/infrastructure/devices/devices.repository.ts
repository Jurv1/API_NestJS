import { Injectable } from '@nestjs/common';
import {
  Device,
  DeviceModelType,
} from '../../schemas/devices/schemas/devices.database.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: DeviceModelType,
  ) {}

  async deleteAllExceptActive(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.deviceModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });

    return !!result;
  }

  async deleteOneDeviceById(id: string): Promise<boolean> {
    const result = await this.deviceModel.deleteOne({ deviceId: id });

    return result.deletedCount === 1;
  }

  async deleteAllDevices(userId: string) {
    return await this.deviceModel.deleteMany({ userId: userId });
  }
}
