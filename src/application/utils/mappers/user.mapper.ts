import { UserViewDto } from '../../dto/users/dto/user.view.dto';
import { User } from '../../entities/users/user.entity';
import { UserViewBloggerDto } from '../../dto/users/dto/user.view.blogger.dto';

export class UserMapper {
  mapUser(obj: User[]): UserViewDto {
    return {
      id: obj[0].id.toString(),
      login: obj[0].login,
      email: obj[0].email,
      createdAt: obj[0].createdAt.toISOString(),
      banInfo: {
        isBanned: obj[0].isBanned,
        banDate: obj[0].bansForUserByAdmin.banDate,
        banReason: obj[0].bansForUserByAdmin.banReason,
      },
      //obj[0].banInfo,
    };
  }
  mapUsers(objs: User[]): UserViewDto[] {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        login: el.login,
        email: el.email,
        createdAt: el.createdAt.toISOString(),
        banInfo: {
          isBanned: el.isBanned,
          banDate: el.bansForUserByAdmin.banDate,
          banReason: el.bansForUserByAdmin.banReason,
        },
      };
    });
  }

  mapUsersForBlogger(objs: User[]): UserViewBloggerDto[] {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        login: el.login,
        banInfo: {
          isBanned: true,
          banDate: el.bansForUserByAdmin.banDate,
          banReason: el.bansForUserByAdmin.banReason,
        },
      };
    });
  }
}
