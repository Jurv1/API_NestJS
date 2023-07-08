import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogMapper } from '../../../../../application/utils/mappers/blog.mapper';
import { Errors } from '../../../../../application/utils/handle.error';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';

export class GetOneBlogQueryCommand {
  constructor(public blogId: string) {}
}

@QueryHandler(GetOneBlogQueryCommand)
export class GetOneBlogUseCase
  implements IQueryHandler<GetOneBlogQueryCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: GetOneBlogQueryCommand) {
    const blog: Blog[] = await this.blogQ.getOneBlog(command.blogId);
    if (blog.length === 0) throw new Errors.NOT_FOUND();

    return this.blogMapper.mapBlog(blog);
  }
}
