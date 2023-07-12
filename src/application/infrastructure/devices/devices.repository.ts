import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device } from '../../entities/devices/device.entity';

export class DevicesRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Device) private readonly devicesRepo: Repository<Device>,
  ) {}

  async createNewDevice(deviceDto: Device): Promise<Device | null> {
    return await this.devicesRepo.save(deviceDto);
  }
  async deleteAllExceptActive(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.devicesRepo
      .createQueryBuilder('d')
      .delete()
      .from(Device)
      .where('deviceId != :id AND userId = :userId', {
        id: deviceId,
        userId: userId,
      })
      .execute();

    return !!result;
  }

  async deleteOneDeviceById(id: string): Promise<boolean> {
    const result = await this.devicesRepo.delete({ deviceId: id });

    return result.affected === 1;
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
