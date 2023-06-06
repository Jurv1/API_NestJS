import { UsersRepository } from '../../../application/infrastructure/users/users.repository';
import { UserQ } from '../../../application/infrastructure/users/users.query.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/blogs.repository';
import { CommentRepository } from '../../../application/infrastructure/comments/comments.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { LikesRepository } from '../../../application/infrastructure/likes/likes.repository';

export const allReposForUserModule = [
  UsersRepository,
  UserQ,
  BlogsRepository,
  CommentRepository,
  DevicesRepository,
  LikesRepository,
];
