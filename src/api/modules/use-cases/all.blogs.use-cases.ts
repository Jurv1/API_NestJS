import { CreateBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/create.blog.use-case';
import { CreatePostForBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/create.post.for.blog.use-case';
import { DeleteOneBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/delete.one.blog.use-case';
import { DeleteOnePostBySpecificBlogIdUseCase } from '../../_blogger/blogs.blogger/use-cases/delete.one.post.by.specific.blog.id.use-case';
import { UpdateBlogUseCase } from '../../_blogger/blogs.blogger/use-cases/update.blog.use-case';
import { UpdatePostByBlogIdUseCase } from '../../_blogger/blogs.blogger/use-cases/update.post.by.blog.id.use-case';
import { UpdateBanStatusForBlogsByOwnerUseCase } from '../../../application/infrastructure/blogs/use-cases/update.ban.status.for.blogs.by.owner.use-case';

export const allBlogsUseCases = [
  CreateBlogUseCase,
  CreatePostForBlogUseCase,
  DeleteOneBlogUseCase,
  DeleteOnePostBySpecificBlogIdUseCase,
  UpdateBlogUseCase,
  UpdatePostByBlogIdUseCase,
  UpdateBanStatusForBlogsByOwnerUseCase,
];
