import { CommentatorDto } from './commentator.dto';
import { PostInfoDto } from '../../posts/dto/post.info.dto';

export class CommentCreatingDto {
  content: string;
  commentatorInfo: CommentatorDto;
  postInfo: PostInfoDto;
}
