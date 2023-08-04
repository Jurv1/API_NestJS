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
      .from(Device, 'd')
      .where('deviceId != :id AND userId = :userId', {
        id: deviceId,
        userId: +userId,
      })
      .execute();

    return !!result;
  }

  async deleteOneDeviceById(id: string): Promise<boolean> {
    const result = await this.devicesRepo.delete({ deviceId: id });

    return result.affected === 1;
  }

  async deleteAllDevices(userId: string) {
    return await this.devicesRepo
      .createQueryBuilder('d')
      .delete()
      .from(Device)
      .where('userId = :id', { id: userId })
      .execute();
  }

  async updateDevice(oldDeviceId: string, newDeviceId: string, newIat: number) {
    await this.devicesRepo
      .createQueryBuilder('d')
      .update(Device)
      .set({ LastActiveDate: new Date(newIat * 1000), deviceId: newDeviceId })
      .where('deviceId = :id', { id: oldDeviceId })
      .execute();
  }

  async updateDeviceIat(deviceId: string, iat: number): Promise<boolean> {
    const result = await this.devicesRepo
      .createQueryBuilder('d')
      .update(Device)
      .set({ LastActiveDate: new Date(iat * 1000) })
      .where('deviceId = :id', { id: deviceId })
      .execute();

    return result[1] === 1;
  }
}
