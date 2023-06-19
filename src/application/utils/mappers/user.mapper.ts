import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { UserViewDto } from '../../dto/users/dto/user.view.dto';

export class UserMapper {
  mapUser(obj: UserDocument): UserViewDto {
    return {
      id: obj[0].Id,
      login: obj[0].Login,
      email: obj[0].Email,
      createdAt: obj[0].CreatedAt,
      banInfo: {
        isBanned: obj[0].IsBanned,
        banDate: obj[0].BanDate,
        banReason: obj[0].BanReason,
      },
      //obj[0].banInfo,
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
