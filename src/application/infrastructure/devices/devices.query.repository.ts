import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device } from '../../entities/devices/device.entity';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Device) private readonly deviseRepo: Repository<Device>,
  ) {}
  async getAllDevicesByUserId(userId: string): Promise<Device[] | null> {
    return this.deviseRepo
      .createQueryBuilder('d')
      .where('d.userId = :id', { id: userId })
      .getMany();
    // return this.dataSource.query(
    //   `
    //   SELECT *
    //   FROM public."device"
    //   WHERE
    //     "userId" = $1;
    //   `,
    //   [userId],
    // );
  }

  async getOneDeviceById(deviceId: string): Promise<Device[] | null> {
    return this.deviseRepo.find({
      where: {
        deviceId: deviceId,
      },
    });
    // return this.dataSource.query(
    //   `
    //   SELECT *
    //   FROM public."device"
    //   WHERE
    //     "deviceId" = $1;
    //   `,
    //   [deviceId],
    // );
  }
}
