import { CommentatorInfo } from './commentator.info.schema';
import { LikesInfo } from '../../likes/dto/likes.info';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
}
