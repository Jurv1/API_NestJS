import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceCreateDto } from '../../dto/devices/dto/device-create.dto';
import { Device } from '../../entities/devices/device.entity';

export class DevicesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createNewDevice(deviceDto: DeviceCreateDto): Promise<Device[] | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."device"
        ("ip", "title", "userId", "deviceId", "lastActiveDate")
      VALUES($1, $2, $3, $4, $5)
      RETURNING "deviceId", "ip", "title", "userId", "lastActiveDate";
      `,
      [
        deviceDto.ip,
        deviceDto.title,
        deviceDto.userId,
        deviceDto.deviceId,
        deviceDto.lastActiveDate,
      ],
    );
  }
  async deleteAllExceptActive(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE
      FROM public."device"
      WHERE
        "userId" = $1 
            AND "deviceId" != $2;
      `,
      [userId, deviceId],
    );

    return !!result;
  }

  async deleteOneDeviceById(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE 
      FROM public."device"
      WHERE
        "deviceId" = $1;
      `,
      [id],
    );

    return result[1] === 1;
  }

  async deleteAllDevices(userId: string) {
    return this.dataSource.query(
      `
      DELETE 
      FROM public."device"
      WHERE "userId" = $1;
      `,
      [userId],
    );
  }

  async updateDevice(oldDeviceId: string, newDeviceId: string, newIat: number) {
    await this.dataSource.query(
      `
      UPDATE public."device"
        SET "deviceId" = $1, 
                "lastActiveDate" = $2
      WHERE
        "deviceId" = $3;
      `,
      [newDeviceId, new Date(newIat * 1000).toISOString(), oldDeviceId],
    );
  }

  async updateDeviceIat(deviceId: string, iat: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      UPDATE public."device"
        SET "lastActiveDate" = $1
      WHERE "deviceId" = $2;
      `,
      [new Date(iat * 1000).toISOString(), deviceId],
    );

    return result[1] === 1;
  }
}
