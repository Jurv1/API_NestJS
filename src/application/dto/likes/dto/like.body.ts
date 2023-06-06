import { IsEnum } from 'class-validator';

enum LikesStatuses {
  'Like',
  'Dislike',
  'None',
}
export class LikeBody {
  @IsEnum(LikesStatuses)
  likeStatus: string;
}
