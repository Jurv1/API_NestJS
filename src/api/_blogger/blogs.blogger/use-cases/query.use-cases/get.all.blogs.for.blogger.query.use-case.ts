import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogMapper } from '../../../../../application/utils/mappers/blog.mapper';
import { FilterQuery, SortOrder } from 'mongoose';
import { BlogDocument } from '../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllBlogsForBloggerQueryCommand {
  constructor(
    public filter: FilterQuery<BlogDocument>,
    public sort: { [key: string]: SortOrder },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    public userId: string,
  ) {}
}

@QueryHandler(GetAllBlogsForBloggerQueryCommand)
export class GetAllBlogsForBloggerQueryUseCase
  implements IQueryHandler<GetAllBlogsForBloggerQueryCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: GetAllBlogsForBloggerQueryCommand) {
    const allBlogs = await this.blogQ.getAllBlogsForBlogger(
      command.filter,
      command.sort,
      command.pagination,
      command.userId,
    );
    const mappedBlogsForBlogger = await this.blogMapper.mapBlogs(allBlogs);

    const countedBlogs: number = await this.blogQ.countBlogsForBlogger(
      command.filter,
      command.userId,
    );

    return paginator(
      countedBlogs,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedBlogsForBlogger,
    );
  }
}
