import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { UserViewDto } from '../../dto/users/dto/user.view.dto';

export class UserMapper {
  mapUser(obj: UserDocument): UserViewDto {
    return {
      id: obj[0].id.toString(),
      login: obj[0].login,
      email: obj[0].email,
      createdAt: obj[0].createdAt,
      banInfo: {
        isBanned: obj[0].isBanned,
        banDate: obj[0].banDate,
        banReason: obj[0].banReason,
      },
      //obj[0].banInfo,
    };
  }
  mapUsers(objs: any): any {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        login: el.login,
        email: el.email,
        createdAt: el.createdAt,
        banInfo: {
          isBanned: el.isBanned,
          banDate: el.banDate,
          banReason: el.banReason,
        },
      };
    });
  }

  mapUsersForBlogger(objs: any): any {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        login: el.login,
        banInfo: {
          isBanned: true,
          banDate: el.banDate,
          banReason: el.banReason,
        },
      };
    });
  }
}
