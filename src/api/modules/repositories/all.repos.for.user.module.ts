import { CommentRepository } from '../../../application/infrastructure/comments/comments.repository';
import { LikesRepository } from '../../../application/infrastructure/likes/_Mongo/likes.repository';
import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/blogs.repository';

export const allReposForUserModule = [
  UsersRepository,
  UsersQueryRepository,
  BlogsRepository,
  CommentRepository,
  DevicesRepository,
  LikesRepository,
];
