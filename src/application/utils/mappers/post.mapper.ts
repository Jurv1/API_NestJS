import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { PostViewModel } from '../../schemas/posts/schemas/post-view.model';
import { LikesRepository } from '../../infrastructure/likes/_Mongo/likes.repository';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { mapLikes } from './like.mapper';
import { NewestLike } from '../../schemas/posts/schemas/likes.schemas/newest.likes';
import { Inject } from '@nestjs/common';

export class PostMapper {
  constructor(
    @Inject(LikesRepository) protected readonly likesRepo: LikesRepository,
  ) {}

  async mapPost(obj: PostDocument, userId?: string): Promise<PostViewModel> {
    const postId = obj[0].Id.toString();
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    const allLikes = await this.likesRepo.countAllLikesForPostOrComment(postId);
    const allDislikes = await this.likesRepo.countAllDislikesForPostOrComment(
      postId,
    );
    if (userId) {
      like = await this.likesRepo.getUserStatusForCommentOrPost(
        userId.toString(),
        postId,
      );
      userStatus = like?.userStatus;
    }
    const lastThreeLikes: any = await this.likesRepo.findLatestThreeLikes(
      postId,
    );
    const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
    return {
      id: obj[0].Id.toString(),
      title: obj[0].Title,
      shortDescription: obj[0].ShortDescription,
      content: obj[0].Content,
      blogId: obj[0].BlogId.toString(),
      blogName: obj[0].BlogName,
      extendedLikesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
        newestLikes: newestLikes || [],
      },
      createdAt: obj[0].CreatedAt,
    };
  }

  async mapPosts(objs: any, userId?: string | null): Promise<PostViewModel[]> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const postId = el.Id.toString();
        const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
          postId,
        );
        const allDislikes =
          await this.likesRepo.countAllDislikesForPostOrComment(postId);
        const lastThreeLikes: any = await this.likesRepo.findLatestThreeLikes(
          postId,
        );
        if (userId) {
          like = await this.likesRepo.getUserStatusForCommentOrPost(
            userId.toString(),
            postId,
          );
          userStatus = like?.userStatus;
        }

        const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
        return {
          id: postId,
          title: el.Title,
          shortDescription: el.ShortDescription,
          content: el.Content,
          blogId: el.BlogId.toString(),
          blogName: el.BlogName,
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
