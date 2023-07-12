import { UserViewDto } from '../../dto/users/dto/user.view.dto';
import { User } from '../../entities/users/user.entity';
import { UserViewBloggerDto } from '../../dto/users/dto/user.view.blogger.dto';

export class UserMapper {
  mapUser(obj: User): UserViewDto {
    return {
      id: obj.id.toString(),
      login: obj.login,
      email: obj.email,
      createdAt: obj.createdAt.toISOString(),
      banInfo: {
        isBanned: obj.isBanned,
        banDate: null,
        banReason: null,
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
          banDate: el.bansForUserByAdmin.banDate || null,
          banReason: el.bansForUserByAdmin.banReason || null,
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
