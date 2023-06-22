import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceCreateDto } from '../../dto/devices/dto/device-create.dto';

export class DevicesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createNewDevice(deviceDto: DeviceCreateDto) {
    const deviceId = await this.dataSource.query(
      `
      INSERT INTO public."Devices"
        ("Ip", "Title", "UserId", "DeviceId", "LastActiveDate")
      VALUES($1, $2, $3, $4, $5)
      RETURNING "DeviceId";
      `,
      [
        deviceDto.ip,
        deviceDto.title,
        deviceDto.userId,
        deviceDto.deviceId,
        deviceDto.lastActiveDate,
      ],
    );

    return await this.dataSource.query(
      `
      SELECT *
      FROM public."Devices"
      WHERE
        "DeviceId" = $1;
      `,
      [deviceId[0].DeviceId],
    );
  }
  async deleteAllExceptActive(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE
      FROM public."Devices"
      WHERE
        "UserId" = $1 
            AND "DeviceId" != $2;
      `,
      [userId, deviceId],
    );

    return !!result;
  }

  async deleteOneDeviceById(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE 
      FROM public."Devices"
      WHERE
        "DeviceId" = $1;
      `,
      [id],
    );

    return result[1] === 1;
  }

  async deleteAllDevices(userId: string) {
    return this.dataSource.query(
      `
      DELETE 
      FROM public."Devices"
      WHERE "UserId" = $1;
      `,
      [userId],
    );
  }

  async updateDevice(oldDeviceId: string, newDeviceId: string, newIat: number) {
    await this.dataSource.query(
      `
      UPDATE public."Devices"
        SET "DeviceId" = $1, 
                "LastActiveDate" = $2
      WHERE
        "DeviceId" = $3;
      `,
      [newDeviceId, new Date(newIat * 1000).toISOString(), oldDeviceId],
    );
  }

  async updateDeviceIat(deviceId: string, iat: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      UPDATE public."Devices"
        SET "LastActiveDate" = $1
      WHERE "DeviceId" = $2;
      `,
      [new Date(iat * 1000).toISOString(), deviceId],
    );

    return result[1] === 1;
  }
}
