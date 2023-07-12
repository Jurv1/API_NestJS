import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerBanDto } from '../../../../../application/dto/blogs/dto/blogger.ban.dto';
import { Errors } from '../../../../../application/utils/handle.error';
import { BannedUserDto } from '../../../../../application/dto/blogs/dto/banned.user.dto';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { UsersQueryRepository } from '../../../../../application/infrastructure/users/users.query.repository';
import { BlogsRepository } from '../../../../../application/infrastructure/blogs/blogs.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';
import { User } from '../../../../../application/entities/users/user.entity';
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
    const blogInfo: Blog[] = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.bloggerBanDto.blogId,
    );

    if (blogInfo[0].owner.id.toString() !== command.ownerId)
      throw new Errors.FORBIDDEN();

    const user: User = await this.userQ.getOneUserById(command.userId);
    if (!user) throw new Errors.NOT_FOUND();

    if (command.bloggerBanDto.isBanned) {
      const bannedUser: BannedUserDto = {
        id: user[0].id.toString(),
        login: user[0].login,
        banInfo: {
          isBanned: command.bloggerBanDto.isBanned,
          banReason: command.bloggerBanDto.banReason,
          banDate: new Date().toISOString(),
        },
      };
      await this.blogRepository.banUserInBlog(
        blogInfo[0].id.toString(),
        bannedUser,
      );
    } else {
      await this.blogRepository.unbanUserInBlog(
        blogInfo[0].id.toString(),
        user[0].id.toString(),
      );
    }
  }
}
