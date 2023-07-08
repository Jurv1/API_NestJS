import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { PostViewModel } from '../../schemas/posts/schemas/post-view.model';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { mapLikes } from './like.mapper';
import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';
import { Inject } from '@nestjs/common';
import { PostsLikesRepository } from '../../infrastructure/likes/posts.likes.repository';
import { Post } from '../../entities/posts/post.entity';

export class PostMapper {
  constructor(
    @Inject(PostsLikesRepository)
    protected readonly likesRepo: PostsLikesRepository,
  ) {}

  async mapPost(obj: Post, userId?: string): Promise<PostViewModel> {
    const postId = obj[0].id.toString();
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    const allLikes = await this.likesRepo.countAllLikesForPost(postId);
    const allDislikes = await this.likesRepo.countAllDislikesForPost(postId);
    if (userId) {
      like = await this.likesRepo.getUserStatusForPost(
        userId.toString(),
        postId,
      );
      userStatus = like[0]?.LikeStatus;
    }
    const lastThreeLikes: any = await this.likesRepo.findLatestThreeLikes(
      postId,
    );
    const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
    return {
      id: obj[0].id.toString(),
      title: obj[0].title,
      shortDescription: obj[0].shortDescription,
      content: obj[0].content,
      blogId: obj[0].blogId.toString(),
      blogName: obj[0].blogName,
      extendedLikesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
        newestLikes: newestLikes || [],
      },
      createdAt: obj[0].createdAt,
    };
  }

  async mapPosts(objs: any, userId?: string | null): Promise<PostViewModel[]> {
    let like: any | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const postId = el.id.toString();
        const allLikes = await this.likesRepo.countAllLikesForPost(postId);
        const allDislikes = await this.likesRepo.countAllDislikesForPost(
          postId,
        );
        const lastThreeLikes: any = await this.likesRepo.findLatestThreeLikes(
          postId,
        );
        if (userId) {
          like = await this.likesRepo.getUserStatusForPost(
            userId.toString(),
            postId,
          );
          userStatus = like[0]?.LikeStatus;
        }

        const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
        return {
          id: postId,
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId.toString(),
          blogName: el.blogName,
          extendedLikesInfo: {
            likesCount: allLikes,
            dislikesCount: allDislikes,
            myStatus: userStatus || 'None',
            newestLikes: newestLikes || [],
          },
          createdAt: el.createdAt,
        };
      }),
    );
  }
}
