import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';

export function mapLikes(objs: any): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.AddedAt.toString(),
      userId: el.Id.toString(),
      login: el.Login,
    };
  });
}
