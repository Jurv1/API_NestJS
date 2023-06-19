import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceModelType,
} from '../../../schemas/devices/schemas/devices.database.schema';

@Injectable()
export class _MongoDevicesRepository {
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
    return this.deviceModel.deleteMany({ userId: userId });
  }
}
