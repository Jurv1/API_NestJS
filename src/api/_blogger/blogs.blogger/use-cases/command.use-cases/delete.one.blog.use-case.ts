import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { BlogDocument } from '../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';

export class DeleteOneBlogCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(DeleteOneBlogCommand)
export class DeleteOneBlogUseCase
  implements ICommandHandler<DeleteOneBlogCommand>
{
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQ: BlogsQueryRepository,
  ) {}

  async execute(command: DeleteOneBlogCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlog(command.blogId);
    if (!blog) throw new Errors.NOT_FOUND();
    if (blog.ownerInfo.userId !== command.userId) throw new Errors.FORBIDDEN();
    const result: boolean = await this.blogService.deleteOneBlog(
      command.blogId,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
