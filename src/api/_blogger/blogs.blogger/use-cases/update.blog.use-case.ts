import { ICommandHandler } from '@nestjs/cqrs';
import { BlogQ } from '../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogService } from '../../../../application/infrastructure/blogs/blogs.service';
import { BlogDocument } from '../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../application/utils/handle.error';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private readonly blogQ: BlogQ,
    private readonly blogService: BlogService,
  ) {}
  async execute(command: UpdateBlogCommand) {
    const foundedBlog: BlogDocument = await this.blogQ.getOneBlog(
      command.blogId,
    );
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
