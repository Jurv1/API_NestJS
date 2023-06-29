import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogQ } from '../../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';
import { BlogDocument } from '../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogsQueryRepository } from '../../../../application/infrastructure/blogs/blogs.query.repository';
import { errorIfNan } from '../../../../application/utils/funcs/is.Nan';
import { Errors } from '../../../../application/utils/handle.error';
import { BlogService } from '../../../../application/infrastructure/blogs/blogs.service';

export class BanUnbanBlogByIdCommand {
  constructor(public blogId: string, public isBanned: boolean) {}
}
@CommandHandler(BanUnbanBlogByIdCommand)
export class BanUnbanBlogByIdUseCase
  implements ICommandHandler<BanUnbanBlogByIdCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogService: BlogService,
  ) {}

  async execute(command: BanUnbanBlogByIdCommand) {
    errorIfNan(command.blogId);
    const blog: any = await this.blogQ.getOneBlogForAdmin(command.blogId);
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    await this.blogService.updateBanInfoForBlog(
      command.blogId,
      command.isBanned,
    );
    return;
  }
}
