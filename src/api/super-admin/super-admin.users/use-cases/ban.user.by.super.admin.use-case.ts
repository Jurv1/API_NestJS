import { ICommandHandler } from '@nestjs/cqrs';
import { BanBody } from '../../../../users/dto/ban.body';
import { UserQ } from '../../../../users/users.query.repository';
import { UserDocument } from '../../../../users/schemas/users.database.schema';
import { DevicesRepository } from '../../../../devices/devices.repository';
import { Errors } from '../../../../utils/handle.error';

export class BanUserBySuperAdminCommand {
  constructor(public userId: string, public banInfo: BanBody) {}
}
export class BanUserBySuperAdminUseCase
  implements ICommandHandler<BanUserBySuperAdminCommand>
{
  constructor(
    private readonly userQ: UserQ,
    private readonly deviceRepository: DevicesRepository,
  ) {}

  async execute(command: BanUserBySuperAdminCommand) {
    const user: UserDocument = await this.userQ.getOneUserById(command.userId);
    if (!user) throw new Errors.NOT_FOUND();
    const deleteDevicesResult = await this.deviceRepository.deleteAllDevices(
      command.userId,
    );
    await user.updateBanInfo(command.banInfo);
    await user.save();
    return true;
  }
}
