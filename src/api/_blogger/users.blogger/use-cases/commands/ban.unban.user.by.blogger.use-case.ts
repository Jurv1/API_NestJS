import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerBanDto } from '../../../../../application/dto/blogs/dto/blogger.ban.dto';
import { Errors } from '../../../../../application/utils/handle.error';
import { BannedUserDto } from '../../../../../application/dto/blogs/dto/banned.user.dto';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { UsersQueryRepository } from '../../../../../application/infrastructure/users/users.query.repository';
import { BlogsRepository } from '../../../../../application/infrastructure/blogs/blogs.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
export class BanUnbanUserByBloggerCommand {
  constructor(
    public userId: string,
    public ownerId: string,
    public bloggerBanDto: BloggerBanDto,
  ) {}
}

@CommandHandler(BanUnbanUserByBloggerCommand)
export class BanUnbanUserByBloggerUseCase
  implements ICommandHandler<BanUnbanUserByBloggerCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly userQ: UsersQueryRepository,
    private readonly blogRepository: BlogsRepository,
  ) {}
  async execute(command: BanUnbanUserByBloggerCommand) {
    errorIfNan(command.bloggerBanDto.blogId, command.userId, command.ownerId);
    const blogInfo: any = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.bloggerBanDto.blogId,
    );

    if (blogInfo[0].OwnerId !== command.ownerId) throw new Errors.FORBIDDEN();

    const user: any = await this.userQ.getOneUserById(command.userId);
    if (user.length === 0) throw new Errors.NOT_FOUND();

    if (command.bloggerBanDto.isBanned) {
      const bannedUser: BannedUserDto = {
        id: user[0].Id,
        login: user[0].Login,
        banInfo: {
          isBanned: command.bloggerBanDto.isBanned,
          banReason: command.bloggerBanDto.banReason,
          banDate: new Date().toISOString(),
        },
      };
      await this.blogRepository.banUserInBlog(blogInfo[0].Id, bannedUser);
    } else {
      await this.blogRepository.unbanUserInBlog(blogInfo[0].Id, user[0].Id);
    }
  }
}
