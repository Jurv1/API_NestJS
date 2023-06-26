import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../../../application/utils/handle.error';
import { BlogQ } from '../../../../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';
import { BannedUserDto } from '../../../../../../application/dto/blogs/dto/banned.user.dto';
import { filterForBannedUsers } from '../../../../../../application/utils/filters/_MongoFilters/filter.for.banned.users';
import { QueryForBannedUsers } from '../../../../../../application/dto/blogs/dto/queries/query.for.banned.users';
import { makePagination } from '../../../../../../application/utils/make.paggination';
import { UserQ } from '../../../../../../application/infrastructure/users/_MongoDB/users.query.repository';
import { sortForBannedUsers } from '../../../../../../application/utils/sorts/_MongoSorts/sort.for.banned.users';

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
  constructor(private readonly blogQ: BlogQ, private readonly userQ: UserQ) {}
  async execute(command: GetAllBannedUsersByBlogIdCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlog(command.blogId);
    if (!blog) throw new Errors.NOT_FOUND();
    if (blog.ownerInfo.userId !== command.userId) throw new Errors.FORBIDDEN();

    const allBannedUsersForBlog: BannedUserDto[] | [] = blog.bannedUsersForBlog;

    const pagination = makePagination(
      command.query.pageNumber,
      command.query.pageSize,
    );
    const bannedIds = [];
    blog.bannedUsersForBlog.forEach((el: BannedUserDto) => {
      bannedIds.push(el.id);
    });
    const filter = filterForBannedUsers(
      command.query.searchLoginTerm,
      bannedIds,
    );

    const sort = sortForBannedUsers(
      command.query.sortBy,
      command.query.sortDirection,
    );

    const bannedUsers = await this.userQ.getAllUsersInBannedBlog(
      filter,
      sort,
      pagination,
    );
    const bans = [...blog.bannedUsersForBlog];
    return {
      pagesCount: Math.ceil(allBannedUsersForBlog.length / pagination.pageSize),
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: allBannedUsersForBlog.length,
      items: bannedUsers.map((el) => {
        const user = bans.find((obj) => obj.id == el._id.toString());
        return {
          id: el._id.toString(),
          login: el.accountData.login,
          banInfo: user.banInfo,
        };
      }),
    };
  }
}
