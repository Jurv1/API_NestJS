import { Injectable } from '@nestjs/common';
import {
  DeviceDocument,
  DeviceModelType,
} from './schemas/devices.database.schema';
import { DeviceCreateDto } from './dto/device-create.dto';

@Injectable()
export class DevicesRepository {
  constructor(private readonly deviceModel: DeviceModelType) {}
  async createNewDevice(deviceCreateDto: DeviceCreateDto): Promise<any> {
    const device: DeviceDocument = await this.deviceModel.createDevice(
      deviceCreateDto,
      this.deviceModel,
    );
    return device.save();
  }

  async deleteAllExceptActive(userId: string, deviceId: string) {
    const result = await this.deviceModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });

    return !!result;
  }

  async deleteOneDeviceById(id: string) {
    const result = await this.deviceModel.deleteOne({ deviceId: id });

    return result.deletedCount === 1;
  }

  async updateLastActivity(payload: any) {
    if (!payload.iat) {
      return null;
    }
    const result = await this.deviceModel.updateOne(
      { deviceId: payload.deviceId },
      {
        $set: {
          lastActiveDate: new Date(payload.iat * 1000).toISOString(),
        },
      },
    );
    return result.modifiedCount === 1;
  }
}
