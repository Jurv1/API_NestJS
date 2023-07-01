import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../../application/utils/handle.error';
import { BlogsQueryRepository } from '../../../../../../application/infrastructure/blogs/blogs.query.repository';
import { UsersQueryRepository } from '../../../../../../application/infrastructure/users/users.query.repository';
import { UserMapper } from '../../../../../../application/utils/mappers/user.mapper';
import { paginator } from '../../../../../../application/utils/paginator/paginator';
import { errorIfNan } from '../../../../../../application/utils/funcs/is.Nan';

export class GetAllBannedUsersByBlogIdCommand {
  constructor(
    public filter: { [key: string]: string | boolean },
    public sort: { [key: string]: string },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    public userId: string,
    public blogId: string,
  ) {}
}

@QueryHandler(GetAllBannedUsersByBlogIdCommand)
export class GetAllBannedUsersByBlogIdUseCase
  implements IQueryHandler<GetAllBannedUsersByBlogIdCommand>
{
  constructor(
    private readonly blogQ: BlogsQueryRepository,
    private readonly userQ: UsersQueryRepository,
    private readonly usersMapper: UserMapper,
  ) {}
  async execute(command: GetAllBannedUsersByBlogIdCommand) {
    errorIfNan(command.blogId, command.userId);
    const blog: any = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    if (blog[0].OwnerId !== command.userId) throw new Errors.FORBIDDEN();

    const bannedUsers = await this.blogQ.getAllBannedUsersForBlogger(
      command.filter,
      command.sort,
      command.pagination,
      command.blogId,
    );

    const mappedUsers = await this.usersMapper.mapUsersForBlogger(bannedUsers);

    const countedUsers = await this.blogQ.countAllBannedUsers(
      command.filter,
      command.blogId,
    );

    return paginator(
      +countedUsers,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedUsers,
    );
  }
}
