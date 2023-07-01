import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { UsersQueryRepository } from '../../../../../application/infrastructure/users/users.query.repository';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';

export class BindBlogToUserCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(BindBlogToUserCommand)
export class BindBlogToUserUseCase
  implements ICommandHandler<BindBlogToUserCommand>
{
  constructor(
    private readonly userQ: UsersQueryRepository,
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogService: BlogService,
  ) {}

  async execute(command: BindBlogToUserCommand) {
    const blog: any = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    if (blog[0].OwnerId) throw new Errors.BAD_REQUEST();
    const user: any = await this.userQ.getOneUserById(command.userId);
    if (user.length === 0) throw new Errors.NOT_FOUND();
    await this.blogService.bindUser(user[0].Id, user[0].Login, blog[0].Id);
    return;
  }
}
