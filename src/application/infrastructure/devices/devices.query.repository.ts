import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Device } from '../../entities/devices/device.entity';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllDevicesByUserId(userId: string): Promise<Device[] | null> {
    return this.dataSource.query(
      `
      SELECT * 
      FROM public."device"
      WHERE
        "userId" = $1;
      `,
      [userId],
    );
  }

  async getOneDeviceById(deviceId: string): Promise<Device[] | null> {
    return this.dataSource.query(
      `
      SELECT *
      FROM public."device"
      WHERE
        "deviceId" = $1;
      `,
      [deviceId],
    );
  }
}
