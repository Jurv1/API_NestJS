import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { BlogDocument } from '../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../../application/utils/handle.error';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';

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
    //todo вставить вместо getOneBlog getOneBlogByBlogger
    const foundedBlog: any = await this.blogQ.getOneBlog(command.blogId);
    if (foundedBlog.length === 0) throw new Errors.NOT_FOUND();
    if (foundedBlog.ownerInfo.userId !== command.userId)
      throw new Errors.FORBIDDEN();
    const result = await this.blogService.updateOneBlog(
      foundedBlog,
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
