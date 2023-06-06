import { ICommandHandler } from '@nestjs/cqrs';
import { DevicesService } from '../../../../application/infrastructure/devices/devices.service';
import { Errors } from '../../../../application/utils/handle.error';

export class DeleteAllDevicesExceptActiveCommand {
  constructor(public userId: string, public deviceId: string) {}
}

export class DeleteAllDevicesExceptActiveUseCase
  implements ICommandHandler<DeleteAllDevicesExceptActiveCommand>
{
  constructor(private readonly deviceService: DevicesService) {}
  async execute(
    command: DeleteAllDevicesExceptActiveCommand,
  ): Promise<boolean> {
    const isDeleted: boolean =
      await this.deviceService.deleteAllDevicesExceptActive(
        command.userId,
        command.deviceId,
      );
    if (!isDeleted) throw new Errors.NOT_FOUND();
    return true;
  }
}
