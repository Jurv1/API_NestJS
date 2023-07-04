import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';

export function mapLikes(objs: any): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.AddedAt,
      userId: el.UserId,
      login: el.UserLogin,
    };
  });
}
