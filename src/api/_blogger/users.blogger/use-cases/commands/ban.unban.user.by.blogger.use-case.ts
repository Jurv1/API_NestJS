import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerBanDto } from '../../../../../application/dto/blogs/dto/blogger.ban.dto';
import { BlogQ } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogDocument } from '../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../../application/utils/handle.error';
import { UserQ } from '../../../../../application/infrastructure/users/users.query.repository';
import { UserDocument } from '../../../../../application/schemas/users/schemas/users.database.schema';
import { BannedUserDto } from '../../../../../application/dto/blogs/dto/banned.user.dto';
import { BlogsRepository } from '../../../../../application/infrastructure/blogs/blogs.repository';
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
    private readonly blogQ: BlogQ,
    private readonly userQ: UserQ,
    private readonly blogRepository: BlogsRepository,
  ) {}
  async execute(command: BanUnbanUserByBloggerCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlog(
      command.bloggerBanDto.blogId,
    );

    if (blog.ownerInfo.userId !== command.ownerId) throw new Errors.FORBIDDEN();

    const user: UserDocument = await this.userQ.getOneUserById(command.userId);
    if (!user) throw new Errors.NOT_FOUND();

    if (command.bloggerBanDto.isBanned) {
      const arr: string[] = [];
      blog.bannedUsersForBlog.forEach((el) => {
        if (el.id == command.userId) {
          arr.push(el.id);
        }
      });
      if (arr.length > 0) {
        throw new Errors.NOT_FOUND();
      }
      const bannedUser: BannedUserDto = {
        id: user.id,
        login: user.accountData.login,
        banInfo: {
          isBanned: command.bloggerBanDto.isBanned,
          banReason: command.bloggerBanDto.banReason,
          banDate: new Date().toISOString(),
        },
      };
      await this.blogRepository.banUserInBlog(blog.id, bannedUser);
    } else {
      await this.blogRepository.unbanUserInBlog(blog.id, user.id);
    }
  }
}
