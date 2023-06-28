import { UpdateBanStatusForPostsOwnerUseCase } from '../../../application/infrastructure/posts/_Mongo/use-cases/update.ban.status.for.posts.owner.use-case';
import { GetAllPostsQueryUseCase } from '../../_public/posts.public/use-cases/query.use-cases/get.all.posts.query.use-case';
import { GetOnePostQueryUseCase } from '../../_public/posts.public/use-cases/query.use-cases/get.one.post.query.use-case';

export const allPostsUseCases = [
  GetAllPostsQueryUseCase,
  GetOnePostQueryUseCase,
  UpdateBanStatusForPostsOwnerUseCase,
];
