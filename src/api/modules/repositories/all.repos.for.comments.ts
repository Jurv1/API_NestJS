import { CommentsLikesRepository } from '../../../application/infrastructure/likes/comments.likes.repository';
import { CommentsQueryRepository } from '../../../application/infrastructure/comments/comments.query.repository';
import { CommentsRepository } from '../../../application/infrastructure/comments/comments.repository';

export const allReposForComments = [
  CommentsRepository,
  CommentsLikesRepository,
  CommentsQueryRepository,
];
