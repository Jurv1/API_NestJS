import { CommentQ } from '../../../application/infrastructure/comments/_Mongo/comments.query.repository';
import { CommentRepository } from '../../../application/infrastructure/comments/_Mongo/comments.repository';

export const allReposForComments = [CommentQ, CommentRepository];
