import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogMapper } from '../../../../../application/utils/mappers/blog.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllBlogsForAdminQueryCommand {
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

@QueryHandler(GetAllBlogsForAdminQueryCommand)
export class GetAllBlogsForAdminQueryUseCase
  implements IQueryHandler<GetAllBlogsForAdminQueryCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: GetAllBlogsForAdminQueryCommand) {
    const allBlogs = await this.blogQ.getAllBlogsForAdmin(
      command.filter,
      command.sort,
      command.pagination,
    );

    const mapped = this.blogMapper.mapBlogsForAdmin(allBlogs);

    const counts = await this.blogQ.countAllBlogsForAdmin(command.filter);
    return paginator(
      +counts,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mapped,
    );
  }
}
