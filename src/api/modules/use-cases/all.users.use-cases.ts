import { BanUnbanUserBySuperAdminUseCase } from '../../_super-admin/super-admin.users/use-cases/ban.unban.user.by.super.admin.use-case';
import { CreateUserUseCase } from '../../_super-admin/super-admin.users/use-cases/create.user.use-case';
import { DeleteUserBySuperAdminUseCase } from '../../_super-admin/super-admin.users/use-cases/delete.user.by.super.admin.use-case';

export const allUsersUseCases = [
  BanUnbanUserBySuperAdminUseCase,
  CreateUserUseCase,
  DeleteUserBySuperAdminUseCase,
];
