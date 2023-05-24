import { LikeDocument } from '../../likes/schemas/like.database.schema';
import { NewestLike } from '../../posts/schemas/likes.schemas/newest.likes';

export function mapLikes(objs: LikeDocument[]): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.userLogin,
    };
  });
}
