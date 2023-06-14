import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogQ } from '../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogDocument } from '../../../../application/schemas/blogs/schemas/blogs.database.schema';

export class BanUnbanBlogByIdCommand {
  constructor(public blogId: string, public isBanned: boolean) {}
}
@CommandHandler(BanUnbanBlogByIdCommand)
export class BanUnbanBlogByIdUseCase
  implements ICommandHandler<BanUnbanBlogByIdCommand>
{
  constructor(private readonly blogQ: BlogQ) {}

  async execute(command: BanUnbanBlogByIdCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlogForAdmin(
      command.blogId,
    );
    await blog.updateBanInfoForBlog(command.isBanned);
    await blog.markModified('banInfo');
    await blog.save();
    return;
  }
}
