import { CommentatorDto } from './commentator.dto';
import { LikesInfo } from '../../likes/dto/likes.info';

export class CommentCreatingDto {
  content: string;
  commentatorInfo: CommentatorDto;
  likesInfo: LikesInfo;
  postId: string;
}
