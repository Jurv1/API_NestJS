import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../../../application/infrastructure/users/users.query.repository';
import { UserMapper } from '../../../../../application/utils/mappers/user.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllUsersByAdminQueryCommand {
  constructor(
    public filter: { [key: string]: string | boolean },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    public sortingObj: { [key: string]: string },
  ) {}
}

@QueryHandler(GetAllUsersByAdminQueryCommand)
export class GetAllUsersByAdminUseCase
  implements IQueryHandler<GetAllUsersByAdminQueryCommand>
{
  constructor(
    private readonly userQ: UsersQueryRepository,
    private readonly usersMapper: UserMapper,
  ) {}
  async execute(command: GetAllUsersByAdminQueryCommand) {
    const result = await this.userQ.getAllUsersForAdmin(
      command.filter,
      command.sortingObj,
      command.pagination,
    );
    //if (result.length === 0) throw new Errors.NOT_FOUND();

    const countedRows = await this.userQ.countAllUsersRows(command.filter);

    const mappedUsers = this.usersMapper.mapUsers(result);

    return paginator(
      +countedRows[0].count,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedUsers,
    );
  }
}
