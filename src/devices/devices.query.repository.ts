import { Injectable } from '@nestjs/common';
import { DeviceModelType } from './schemas/devices.database.schema';

@Injectable()
export class DeviceQ {
  constructor(private readonly deviceModel: DeviceModelType) {}
  async getAllDevicesByUserId(userId: string) {
    return this.deviceModel.find({ userId: userId }).lean();
  }

  async getOneDeviceById(deviceId: string) {
    return this.deviceModel.findOne({ deviceId: deviceId });
  }

  async getOneDeviceByTitleAndUserId(title: string, userId: string) {
    return this.deviceModel.findOne({ title: title, userId: userId });
  }

  async getOneDeviceByUserIdAndDeviceId(userId: string, deviceId: string) {
    return this.deviceModel.findOne({
      $and: [{ userId: userId, deviceId: deviceId }],
    });
  }

  async findOneByDeviceIdUserIdAndTitle(
    userId: string,
    ip: string,
    title: string,
  ) {
    return this.deviceModel.findOne({
      $and: [{ userId: userId, ip: ip, title: title }],
    });
  }

  async findOneByDeviceId(deviceId: string) {
    return this.deviceModel.findOne({ deviceId: deviceId });
  }
}
