import { UserDocument } from '../../users/schemas/users.database.schema';
import { UserViewDto } from '../../users/dto/user.view.dto';
import { UserWithPaginationDto } from '../../users/dto/user.with.pagination.dto';

export class UserMapper {
  mapUser(obj: UserDocument): UserViewDto {
    return {
      id: obj.id,
      login: obj.accountData.login,
      email: obj.accountData.email,
      createdAt: obj.accountData.createdAt,
      banInfo: obj.banInfo,
    };
  }
  mapUsers(objs: UserDocument[] | UserViewDto[]): UserViewDto[] {
    return objs.map((el) => {
      return {
        id: el._id.toString(),
        login: el.accountData.login,
        email: el.accountData.email,
        createdAt: el.accountData.createdAt,
        banInfo: el.banInfo,
      };
    });
  }
}
