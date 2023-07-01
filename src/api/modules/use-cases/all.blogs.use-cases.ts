import { CreateBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/create.blog.use-case';
import { CreatePostForBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/create.post.for.blog.use-case';
import { DeleteOneBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/delete.one.blog.use-case';
import { DeleteOnePostBySpecificBlogIdUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/delete.one.post.by.specific.blog.id.use-case';
import { UpdateBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/update.blog.use-case';
import { UpdatePostByBlogIdUseCase } from '../../_blogger/blogs.blogger/use-cases/command.use-cases/update.post.by.blog.id.use-case';
import { UpdateBanStatusForBlogsByOwnerUseCase } from '../../../application/infrastructure/blogs/use-cases/update.ban.status.for.blogs.by.owner.use-case';
import { GetAllBlogsUseCase } from '../../_public/blogs.public/use-cases/query.use-cases/get.all.blogs.use-case';
import { GetOneBlogUseCase } from '../../_public/blogs.public/use-cases/query.use-cases/get.one.blog.use-case';
import { GetAllBlogsForBloggerQueryUseCase } from '../../_blogger/blogs.blogger/use-cases/query.use-cases/get.all.blogs.for.blogger.query.use-case';
import { GetAllBlogsForAdminQueryUseCase } from '../../_super-admin/super-admin.blogs/use-cases/query.use-cases/get.all.blogs.for.admin.query.use-case';
import { BanUnbanBlogByIdUseCase } from '../../_super-admin/super-admin.blogs/use-cases/command.use-cases/ban.unban.blog.by.id.use-case';

export const allBlogsUseCases = [
  GetAllBlogsForBloggerQueryUseCase,
  GetAllBlogsForAdminQueryUseCase,
  GetAllBlogsUseCase,
  GetOneBlogUseCase,
  CreateBlogUseCase,
  CreatePostForBlogUseCase,
  DeleteOneBlogUseCase,
  DeleteOnePostBySpecificBlogIdUseCase,
  UpdateBlogUseCase,
  UpdatePostByBlogIdUseCase,
  UpdateBanStatusForBlogsByOwnerUseCase,
  BanUnbanBlogByIdUseCase,
];
