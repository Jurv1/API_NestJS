import { GetCommentByIdUseCase } from './comments.public/use-cases/get.all.comments.use-case';
import { UpdateCommentUseCase } from './comments.public/use-cases/update.comment.use-case';
import { DeleteCommentUseCase } from './comments.public/use-cases/delete.comment.use-case';
import { LikeCommentOrPostUseCase } from './comments.public/use-cases/like.comment.use-case';

export const publicUseCases = [
  GetCommentByIdUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  LikeCommentOrPostUseCase,
];
