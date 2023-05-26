import { LikesRepository } from '../../likes/likes.repository';
import { LikeDocument } from '../../likes/schemas/like.database.schema';
import { CommentDocument } from '../../comments/schemas/comments.database.schema';
import { CommentViewModel } from '../../comments/schemas/comment-view.model';
import { Inject } from '@nestjs/common';

export class CommentMapper {
  constructor(
    @Inject(LikesRepository) private readonly likesRepo: LikesRepository,
  ) {}

  async mapComment(
    obj: CommentDocument,
    userId?: string | null,
  ): Promise<CommentViewModel> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    const commentId = obj._id.toString();
    const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
      commentId,
    );
    const allDislikes = await this.likesRepo.countAllDislikesForPostOrComment(
      commentId,
    );
    if (userId) {
      like = await this.likesRepo.getUserStatusForComment(
        userId.toString(),
        commentId,
      );
      userStatus = like?.userStatus;
    }
    return {
      id: obj._id.toString(),
      content: obj.content,
      commentatorInfo: {
        userId: obj.commentatorInfo.userId,
        userLogin: obj.commentatorInfo.userLogin,
      },
      createdAt: obj.createdAt,
      likesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
      },
    };
  }

  async mapComments(
    objs: any,
    userId?: string | null,
  ): Promise<CommentViewModel[]> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const commentId = el._id.toString();
        const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
          commentId,
        );
        const allDislikes =
          await this.likesRepo.countAllDislikesForPostOrComment(commentId);
        if (userId) {
          like = await this.likesRepo.getUserStatusForComment(
            userId.toString(),
            commentId,
          );
          userStatus = like?.userStatus;
        }

        return {
          id: commentId,
          content: el.content,
          commentatorInfo: el.commentatorInfo,
          createdAt: el.createdAt,
          likesInfo: {
            likesCount: allLikes,
            dislikesCount: allDislikes,
            myStatus: userStatus || 'None',
          },
        };
      }),
    );
  }
}
