import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogService: BlogService,
  ) {}
  async execute(command: UpdateBlogCommand) {
    errorIfNan(command.blogId);
    const foundedBlog: any = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (foundedBlog.length === 0) throw new Errors.NOT_FOUND();
    if (foundedBlog[0].ownerId !== command.userId) throw new Errors.FORBIDDEN();
    const result = await this.blogService.updateOneBlog(
      foundedBlog[0].id,
      command.name,
      command.description,
      command.websiteUrl,
    );
    if (!result) {
      throw new Errors.NOT_FOUND();
    }
    return;
  }
}
