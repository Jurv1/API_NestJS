import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../../../application/utils/handle.error';
import { BlogQ } from '../../../../../../application/infrastructure/blogs/blogs.query.repository';

export class GetAllBannedUsersByBlogIdCommand {
  constructor(public userId: string, public blogId: string) {}
}

@QueryHandler(GetAllBannedUsersByBlogIdCommand)
export class GetAllBannedUsersByBlogIdUseCase
  implements IQueryHandler<GetAllBannedUsersByBlogIdCommand>
{
  constructor(private readonly blogQ: BlogQ) {}
  async execute(command: GetAllBannedUsersByBlogIdCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlog(command.blogId);
    if (!blog) throw new Errors.NOT_FOUND();
    if (blog.ownerInfo.userId !== command.userId) throw new Errors.FORBIDDEN();
  }
}
