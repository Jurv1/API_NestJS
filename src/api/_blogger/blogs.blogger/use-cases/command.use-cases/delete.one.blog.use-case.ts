import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';

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
    errorIfNan(command.blogId);
    const blog: Blog[] = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    if (blog[0].owner.id.toString() !== command.userId)
      throw new Errors.FORBIDDEN();
    const result: boolean = await this.blogService.deleteOneBlog(
      command.blogId,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
