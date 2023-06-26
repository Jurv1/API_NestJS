import { UserQ } from '../../../application/infrastructure/users/_MongoDB/users.query.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/_MongoDB/blogs.repository';
import { CommentRepository } from '../../../application/infrastructure/comments/comments.repository';
import { LikesRepository } from '../../../application/infrastructure/likes/likes.repository';
import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';

export const allReposForUserModule = [
  UsersRepository,
  UsersQueryRepository,
  UserQ,
  BlogsRepository,
  CommentRepository,
  DevicesRepository,
  LikesRepository,
];
