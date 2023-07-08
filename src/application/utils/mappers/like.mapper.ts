import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';

export function mapLikes(objs: any): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.addedAt.toString(),
      userId: el.id.toString(),
      login: el.login,
    };
  });
}
