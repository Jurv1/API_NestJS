import { LikesRepository } from '../../infrastructure/likes/likes.repository';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { CommentDocument } from '../../schemas/comments/schemas/comments.database.schema';
import { CommentViewModel } from '../../schemas/comments/schemas/comment-view.model';
import { Inject } from '@nestjs/common';
import { CommentsViewForBloggerDto } from '../../dto/comments/dto/comments.view.for.blogger.dto';

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
      like = await this.likesRepo.getUserStatusForCommentOrPost(
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

  mapCommentsForBlogger(
    objs: CommentsViewForBloggerDto[] | CommentDocument[],
  ): CommentsViewForBloggerDto[] {
    return objs.map((el) => {
      return {
        id: el._id,
        content: el.content,
        commentatorInfo: {
          userId: el.commentatorInfo.userId,
          userLogin: el.commentatorInfo.userLogin,
        },
        createdAt: el.createdAt,
        postInfo: {
          id: el.postInfo.id,
          title: el.postInfo.title,
          blogId: el.postInfo.blogId,
          blogName: el.postInfo.blogName,
        },
      };
    });
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
          like = await this.likesRepo.getUserStatusForCommentOrPost(
            userId.toString(),
            commentId,
          );
          userStatus = like?.userStatus;
        }

        return {
          id: commentId,
          content: el.content,
          commentatorInfo: {
            userId: el.commentatorInfo.userId,
            userLogin: el.commentatorInfo.userLogin,
          },
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
