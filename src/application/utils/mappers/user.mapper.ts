import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { UserViewDto } from '../../dto/users/dto/user.view.dto';

export class UserMapper {
  mapUser(obj: UserDocument): UserViewDto {
    return {
      id: obj[0].Id.toString(),
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
  mapUsers(objs: any): any {
    return objs.map((el) => {
      return {
        id: el.Id.toString(),
        login: el.Login,
        email: el.Email,
        createdAt: el.CreatedAt,
        banInfo: {
          isBanned: el.IsBanned,
          banDate: el.BanDate,
          banReason: el.BanReason,
        },
      };
    });
  }

  mapUsersForBlogger(objs: any): any {
    return objs.map((el) => {
      return {
        id: el.Id.toString(),
        login: el.Login,
        banInfo: {
          isBanned: true,
          banDate: el.BanDate,
          banReason: el.BanReason,
        },
      };
    });
  }
}
