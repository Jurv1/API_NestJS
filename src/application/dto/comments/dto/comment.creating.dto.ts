import { CommentatorDto } from './commentator.dto';
import { LikesInfo } from '../../likes/dto/likes.info';
import { PostInfoDto } from '../../posts/dto/post.info.dto';

export class CommentCreatingDto {
  content: string;
  commentatorInfo: CommentatorDto;
  likesInfo: LikesInfo;
  postInfo: PostInfoDto;
}
