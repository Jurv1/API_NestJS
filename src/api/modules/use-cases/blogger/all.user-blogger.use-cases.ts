import { GetAllBannedUsersByBlogIdUseCase } from '../../../_blogger/users.blogger/use-cases/queries/use-cases/get.all.banned.users.by.blog.id.use-case';
import { BanUnbanUserByBloggerUseCase } from '../../../_blogger/users.blogger/use-cases/commands/ban.unban.user.by.blogger.use-case';

export const allUserBloggerUseCases = [
  GetAllBannedUsersByBlogIdUseCase,
  BanUnbanUserByBloggerUseCase,
];
