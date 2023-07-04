import { DeleteCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/delete.comment.use-case';
import { GetCommentByIdUseCase } from '../../_public/comments.public/use-cases/query.use-cases/get.all.comments.use-case';
import { LikeCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/like.comment.use-case';
import { UpdateCommentUseCase } from '../../_public/comments.public/use-cases/command.use-cases/update.comment.use-case';
import { UpdateBanStatusForCommentOwnerUseCase } from '../../../application/infrastructure/comments/_Mongo/use-cases/update.ban.status.for.comment.owner.use-case';
import { GetAllCommentsForBloggerQueryUseCase } from '../../_blogger/blogs.blogger/use-cases/query.use-cases/get.all.comments.for.blogger.query.use-case';

export const allCommentsUseCases = [
  DeleteCommentUseCase,
  GetAllCommentsForBloggerQueryUseCase,
  GetCommentByIdUseCase,
  LikeCommentUseCase,
  UpdateCommentUseCase,
  UpdateBanStatusForCommentOwnerUseCase,
];
