import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';
import { PostsLike } from '../../entities/posts/posts.like.entity';
import { CommentsLike } from '../../entities/comments/comments.like.entity';

export function mapLikes(objs: PostsLike[] | CommentsLike[]): NewestLike[] {
  return objs.map((el) => {
    return {
      addedAt: el.addedAt.toString(),
      userId: el.id.toString(),
      login: el.login,
    };
  });
}
