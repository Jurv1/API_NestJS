import { PostDocument } from '../../posts/schemas/posts.database.schema';
import { PostViewModel } from '../../posts/schemas/post-view.model';
import { LikesRepository } from '../../likes/likes.repository';
import { LikeDocument } from '../../likes/schemas/like.database.schema';
import { mapLikes } from './like.mapper';
import { NewestLike } from '../../posts/schemas/likes.schemas/newest.likes';
import { Inject } from '@nestjs/common';

export class PostMapper {
  constructor(
    @Inject(LikesRepository) protected readonly likesRepo: LikesRepository,
  ) {}

  async mapPost(obj: PostDocument, userId?: string): Promise<PostViewModel> {
    const postId = obj._id.toString();
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    const allLikes = await this.likesRepo.countAllLikesForPostOrComment(postId);
    const allDislikes = await this.likesRepo.countAllDislikesForPostOrComment(
      postId,
    );
    if (userId) {
      like = await this.likesRepo.getUserStatusForComment(
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
      id: obj._id.toString(),
      title: obj.title,
      shortDescription: obj.shortDescription,
      content: obj.content,
      blogId: obj.blogId,
      blogName: obj.blogName,
      extendedLikesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
        newestLikes: newestLikes || [],
      },
      createdAt: obj.createdAt,
    };
  }

  async mapPosts(objs: any, userId?: string | null): Promise<PostViewModel[]> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const postId = el._id.toString();
        const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
          postId,
        );
        const allDislikes =
          await this.likesRepo.countAllDislikesForPostOrComment(postId);
        const lastThreeLikes: any = await this.likesRepo.findLatestThreeLikes(
          postId,
        );
        if (userId) {
          like = await this.likesRepo.getUserStatusForComment(
            userId.toString(),
            postId,
          );
          userStatus = like.userStatus;
        }

        const newestLikes: NewestLike[] = mapLikes(lastThreeLikes);
        return {
          id: postId,
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId,
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
