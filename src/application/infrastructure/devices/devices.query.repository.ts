import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllDevicesByUserId(userId: string) {
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

  async getOneDeviceById(deviceId: string) {
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
