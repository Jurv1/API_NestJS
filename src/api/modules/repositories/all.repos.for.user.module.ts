import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/blogs.repository';
import { CommentsLikesRepository } from '../../../application/infrastructure/likes/comments.likes.repository';
import { PostsLikesRepository } from '../../../application/infrastructure/likes/posts.likes.repository';
import { CommentsRepository } from '../../../application/infrastructure/comments/comments.repository';

export const allReposForUserModule = [
  UsersRepository,
  UsersQueryRepository,
  BlogsRepository,
  CommentsRepository,
  DevicesRepository,
  CommentsLikesRepository,
  PostsLikesRepository,
];
