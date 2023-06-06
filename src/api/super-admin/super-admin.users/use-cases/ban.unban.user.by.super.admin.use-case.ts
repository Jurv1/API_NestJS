import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { BanBody } from '../../../../users/dto/ban.body';
import { UserQ } from '../../../../users/users.query.repository';
import { UserDocument } from '../../../../users/schemas/users.database.schema';
import { DevicesRepository } from '../../../../devices/devices.repository';
import { Errors } from '../../../../utils/handle.error';
import { UpdateBanStatusForLikesOwnerCommand } from '../../../../likes/use-cases/update.ban.status.for.likes.owner.use-case';
import { UpdateBanStatusForPostsOwnerCommand } from '../../../../posts/use-cases/update.ban.status.for.posts.owner.use-case';
import { UpdateBanStatusForBlogsByOwnerCommand } from '../../../../blogs/use-cases/update.ban.status.for.blogs.by.owner.use-case';

export class BanUnbanUserBySuperAdminCommand {
  constructor(public userId: string, public banInfo: BanBody) {}
}
export class BanUnbanUserBySuperAdminUseCase
  implements ICommandHandler<BanUnbanUserBySuperAdminCommand>
{
  constructor(
    private readonly userQ: UserQ,
    private readonly deviceRepository: DevicesRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: BanUnbanUserBySuperAdminCommand) {
    const user: UserDocument = await this.userQ.getOneUserById(command.userId);
    if (!user) throw new Errors.NOT_FOUND();
    if (command.banInfo.isBanned) {
      await this.deviceRepository.deleteAllDevices(command.userId);
    }
    await user.updateBanInfo(command.banInfo);
    await user.save();
    await this.commandBus.execute(
      new UpdateBanStatusForLikesOwnerCommand(
        command.userId,
        command.banInfo.isBanned,
      ),
    );
    await this.commandBus.execute(
      new UpdateBanStatusForPostsOwnerCommand(
        command.userId,
        command.banInfo.isBanned,
      ),
    );

    await this.commandBus.execute(
      new UpdateBanStatusForBlogsByOwnerCommand(
        command.userId,
        command.banInfo.isBanned,
      ),
    );
    return true;
  }
}
