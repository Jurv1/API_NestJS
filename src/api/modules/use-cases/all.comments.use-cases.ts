import { DeleteCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/delete.comment.use-case';
import { GetCommentByIdUseCase } from '../../_public/comments.public/use-cases/query.use-cases/get.all.comments.use-case';
import { LikeCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/like.comment.use-case';
import { UpdateCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/update.comment.use-case';
import { UpdateBanStatusForCommentOwnerUseCase } from '../../../application/infrastructure/comments/_Mongo/use-cases/update.ban.status.for.comment.owner.use-case';

export const allCommentsUseCases = [
  DeleteCommentUseCase,
  GetCommentByIdUseCase,
  LikeCommentUseCase,
  UpdateCommentUseCase,
  UpdateBanStatusForCommentOwnerUseCase,
];
