import { ICommandHandler } from '@nestjs/cqrs';
import { DevicesService } from '../../../../devices/devices.service';
import { Errors } from '../../../../utils/handle.error';

export class DeleteOneDeviceCommand {
  constructor(public deviceId: string) {}
}
export class DeleteOneDeviceUseCase
  implements ICommandHandler<DeleteOneDeviceCommand>
{
  constructor(private readonly deviceService: DevicesService) {}

  async execute(command: DeleteOneDeviceCommand): Promise<boolean> {
    const isDeleted: boolean = await this.deviceService.deleteOneDeviceById(
      command.deviceId,
    );
    if (!isDeleted) throw new Errors.NOT_FOUND();
    return isDeleted;
  }
}
