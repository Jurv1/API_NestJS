import { DeleteCommentUseCase } from '../../_public/comments.public/use-cases/delete.comment.use-case';
import { GetCommentByIdUseCase } from '../../_public/comments.public/use-cases/get.all.comments.use-case';
import { LikeCommentOrPostUseCase } from '../../_public/comments.public/use-cases/like.comment.use-case';
import { UpdateCommentUseCase } from '../../_public/comments.public/use-cases/update.comment.use-case';
import { UpdateBanStatusForCommentOwnerUseCase } from '../../../application/infrastructure/comments/_Mongo/use-cases/update.ban.status.for.comment.owner.use-case';

export const allCommentsUseCases = [
  DeleteCommentUseCase,
  GetCommentByIdUseCase,
  LikeCommentOrPostUseCase,
  UpdateCommentUseCase,
  UpdateBanStatusForCommentOwnerUseCase,
];
