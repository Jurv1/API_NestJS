import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DevicesQueryRepository } from '../../../../../application/infrastructure/devices/devices.query.repository';
import { DevicesRepository } from '../../../../../application/infrastructure/devices/devices.repository';
import { Errors } from '../../../../../application/utils/handle.error';
import { DeviceMapper } from '../../../../../application/utils/mappers/device.mapper';

export class GetAllDevicesQueryCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@QueryHandler(GetAllDevicesQueryCommand)
export class GetAllDevicesUseCase
  implements IQueryHandler<GetAllDevicesQueryCommand>
{
  constructor(
    private readonly deviceQ: DevicesQueryRepository,
    private readonly devicesRepo: DevicesRepository,
    private readonly deviceMapper: DeviceMapper,
  ) {}
  async execute(command: GetAllDevicesQueryCommand) {
    await this.devicesRepo.updateDeviceIat(
      command.deviceId,
      new Date().getTime(),
    );
    const allDevices = await this.deviceQ.getAllDevicesByUserId(command.userId);

    if (allDevices.length > 0) {
      return this.deviceMapper.mapDevices(allDevices);
    }
    throw new Errors.NOT_FOUND();
  }
}
