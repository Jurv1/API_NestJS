import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../../../application/utils/handle.error';
import { BlogQ } from '../../../../../../application/infrastructure/blogs/blogs.query.repository';
import { BannedUserDto } from '../../../../../../application/dto/blogs/dto/banned.user.dto';
import { filterForBannedUsers } from '../../../../../../application/utils/filters/filter.for.banned.users';
import { queryValidator } from '../../../../../../application/utils/sorting.func';
import { QueryForBannedUsers } from '../../../../../../application/dto/blogs/dto/queries/query.for.banned.users';
import { makePagination } from '../../../../../../application/utils/make.paggination';

export class GetAllBannedUsersByBlogIdCommand {
  constructor(
    public query: QueryForBannedUsers,
    public userId: string,
    public blogId: string,
  ) {}
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

    const allBannedUsersForBlog: BannedUserDto[] | [] = blog.bannedUsersForBlog;

    const pagination = makePagination(
      command.query.pageNumber,
      command.query.pageSize,
    );
    const from: number = pagination.pageNumber * pagination.pageSize;
    const filter = filterForBannedUsers(command.query.searchLoginTerm, blog.id);
    const sort = queryValidator(
      command.query.sortBy,
      command.query.sortDirection,
    );
    const blogWithSlicedBannedUsers = await this.blogQ.getSlicedBannedUsers(
      filter,
      sort,
      from,
      +command.query.pageSize,
    );

    return {
      pagesCount: Math.ceil(allBannedUsersForBlog.length / pagination.pageSize),
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: allBannedUsersForBlog.length,
      items: blogWithSlicedBannedUsers,
    };
  }
}
