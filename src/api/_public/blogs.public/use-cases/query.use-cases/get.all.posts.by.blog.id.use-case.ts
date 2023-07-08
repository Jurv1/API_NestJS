import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { PostMapper } from '../../../../../application/utils/mappers/post.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';

export class GetAllPostsByBlogIdQueryCommand {
  constructor(
    public blogId: string,
    public sort: { [key: string]: string },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    public userId?: string,
  ) {}
}

@QueryHandler(GetAllPostsByBlogIdQueryCommand)
export class GetAllPostsByBlogIdUseCase
  implements IQueryHandler<GetAllPostsByBlogIdQueryCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly postQ: PostsQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}
  async execute(command: GetAllPostsByBlogIdQueryCommand) {
    errorIfNan(command.blogId);
    const blog: Blog[] = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();

    const allPosts = await this.postQ.getAllPostsByBlogId(
      command.blogId,
      command.sort,
      command.pagination,
      command.userId,
    );

    const mappedPosts = await this.postMapper.mapPosts(
      allPosts,
      command.userId,
    );
    const counts = await this.postQ.countAllPostsByBlogId(command.blogId);
    return paginator(
      +counts,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedPosts,
    );
  }
}
