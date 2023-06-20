import { BanUnbanUserBySuperAdminUseCase } from '../../_super-admin/super-admin.users/use-cases/command.use-cases/ban.unban.user.by.super.admin.use-case';
import { CreateUserUseCase } from '../../_super-admin/super-admin.users/use-cases/command.use-cases/create.user.use-case';
import { DeleteUserBySuperAdminUseCase } from '../../_super-admin/super-admin.users/use-cases/command.use-cases/delete.user.by.super.admin.use-case';
import { GetAllUsersByAdminUseCase } from '../../_super-admin/super-admin.users/use-cases/query-command.use-cases/get.all.users.by.admin.use-case';

export const allUsersUseCases = [
  GetAllUsersByAdminUseCase,
  BanUnbanUserBySuperAdminUseCase,
  CreateUserUseCase,
  DeleteUserBySuperAdminUseCase,
];
