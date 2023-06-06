import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';

export function mapLikes(objs: LikeDocument[]): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.userLogin,
    };
  });
}
