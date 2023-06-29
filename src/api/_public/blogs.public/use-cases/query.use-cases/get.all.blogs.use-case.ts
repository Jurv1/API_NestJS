import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogMapper } from '../../../../../application/utils/mappers/blog.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllBlogsQueryCommand {
  constructor(
    public filter: { [key: string]: string | boolean },
    public sort: { [key: string]: string },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {}
}

@QueryHandler(GetAllBlogsQueryCommand)
export class GetAllBlogsUseCase
  implements IQueryHandler<GetAllBlogsQueryCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: GetAllBlogsQueryCommand) {
    const allBlogs = await this.blogQ.getAllBlogs(
      command.filter,
      command.sort,
      command.pagination,
    );
    const mapperBlogs = await this.blogMapper.mapBlogs(allBlogs);
    const countedBlogs = await this.blogQ.countAllBlogs(command.filter);

    return paginator(
      +countedBlogs,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mapperBlogs,
    );
  }
}
