import { PostViewModel } from '../../schemas/posts/schemas/post-view.model';
import { mapLikes } from './like.mapper';
import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';
import { Inject } from '@nestjs/common';
import { PostsLikesRepository } from '../../infrastructure/likes/posts.likes.repository';
import { Post } from '../../entities/posts/post.entity';
import { PostsLike } from '../../entities/posts/posts.like.entity';

export class PostMapper {
  constructor(
    @Inject(PostsLikesRepository)
    protected readonly likesRepo: PostsLikesRepository,
  ) {}

  async mapPost(obj: Post[], userId?: string): Promise<PostViewModel> {
    const postId = obj[0].id.toString();
    let like: PostsLike[] | null;
    let userStatus: string | undefined = 'None';
    const allLikes = await this.likesRepo.countAllLikesForPost(postId);
    const allDislikes = await this.likesRepo.countAllDislikesForPost(postId);
    if (userId) {
      like = await this.likesRepo.getUserStatusForPost(
        userId.toString(),
        postId,
      );
      userStatus = like[0]?.likeStatus;
    }
    const lastThreeLikes: PostsLike[] =
      await this.likesRepo.findLatestThreeLikes(postId);
    const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
    return {
      id: obj[0].id.toString(),
      title: obj[0].title,
      shortDescription: obj[0].shortDescription,
      content: obj[0].content,
      blogId: obj[0].blog.id.toString(),
      blogName: obj[0].blog.name,
      extendedLikesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
        newestLikes: newestLikes || [],
      },
      createdAt: obj[0].createdAt.toISOString(),
    };
  }

  async mapPosts(
    objs: Post[],
    userId?: string | null,
  ): Promise<PostViewModel[]> {
    let like: PostsLike[] | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const postId = el.id.toString();
        const allLikes = await this.likesRepo.countAllLikesForPost(postId);
        const allDislikes = await this.likesRepo.countAllDislikesForPost(
          postId,
        );
        const lastThreeLikes: PostsLike[] =
          await this.likesRepo.findLatestThreeLikes(postId);
        if (userId) {
          like = await this.likesRepo.getUserStatusForPost(
            userId.toString(),
            postId,
          );
          userStatus = like[0]?.likeStatus;
        }

        const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
        return {
          id: postId,
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blog.id.toString(),
          blogName: el.blog.name,
          extendedLikesInfo: {
            likesCount: allLikes,
            dislikesCount: allDislikes,
            myStatus: userStatus || 'None',
            newestLikes: newestLikes || [],
          },
          createdAt: el.createdAt.toISOString(),
        };
      }),
    );
  }
}
