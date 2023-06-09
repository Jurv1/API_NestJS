import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanBody } from '../../../../../application/dto/users/dto/ban.body';
import { Errors } from '../../../../../application/utils/handle.error';
import { UpdateBanStatusForLikesOwnerCommand } from '../../../../../application/infrastructure/likes/_Mongo/use-cases/update.ban.status.for.likes.owner.use-case';
import { UpdateBanStatusForPostsOwnerCommand } from '../../../../../application/infrastructure/posts/_Mongo/use-cases/update.ban.status.for.posts.owner.use-case';
import { UpdateBanStatusForBlogsByOwnerCommand } from '../../../../../application/infrastructure/blogs/use-cases/update.ban.status.for.blogs.by.owner.use-case';
import { UpdateBanStatusForCommentOwnerCommand } from '../../../../../application/infrastructure/comments/_Mongo/use-cases/update.ban.status.for.comment.owner.use-case';
import { UsersQueryRepository } from '../../../../../application/infrastructure/users/users.query.repository';
import { UsersRepository } from '../../../../../application/infrastructure/users/users.repository';
import { DevicesRepository } from '../../../../../application/infrastructure/devices/devices.repository';
import { User } from '../../../../../application/entities/users/user.entity';

export class BanUnbanUserBySuperAdminCommand {
  constructor(public userId: string, public banInfo: BanBody) {}
}

@CommandHandler(BanUnbanUserBySuperAdminCommand)
export class BanUnbanUserBySuperAdminUseCase
  implements ICommandHandler<BanUnbanUserBySuperAdminCommand>
{
  constructor(
    private readonly userQ: UsersQueryRepository,
    private readonly usersRepo: UsersRepository,
    private readonly deviceRepository: DevicesRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: BanUnbanUserBySuperAdminCommand) {
    const user: User = await this.userQ.getOneUserById(command.userId);
    if (!user) throw new Errors.NOT_FOUND();
    if (command.banInfo.isBanned) {
      await this.deviceRepository.deleteAllDevices(command.userId);
    } else {
      command.banInfo.banReason = null;
    }
    await this.usersRepo.updateBanInfoForUser(
      user.id.toString(),
      command.banInfo,
    );
    await this.commandBus.execute(
      new UpdateBanStatusForLikesOwnerCommand(
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

    await this.commandBus.execute(
      new UpdateBanStatusForPostsOwnerCommand(
        command.userId,
        command.banInfo.isBanned,
      ),
    );

    await this.commandBus.execute(
      new UpdateBanStatusForCommentOwnerCommand(
        command.userId,
        command.banInfo.isBanned,
      ),
    );
    return true;
  }
}
