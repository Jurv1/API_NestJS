import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { CommentDocument } from '../../schemas/comments/schemas/comments.database.schema';
import { CommentViewModel } from '../../schemas/comments/schemas/comment-view.model';
import { Inject } from '@nestjs/common';
import { CommentsViewForBloggerDto } from '../../dto/comments/dto/comments.view.for.blogger.dto';
import { CommentsLikesRepository } from '../../infrastructure/likes/comments.likes.repository';

export class CommentMapper {
  constructor(
    @Inject(CommentsLikesRepository)
    private readonly likesRepo: CommentsLikesRepository,
  ) {}

  async mapComment(
    obj: any,
    userId?: string | null,
  ): Promise<CommentViewModel> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    const commentId = obj[0].Id.toString();
    const allLikes: number = await this.likesRepo.countAllLikesForComment(
      commentId,
    );
    const allDislikes: number = await this.likesRepo.countAllDislikesForComment(
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
      id: obj[0].Id.toString(),
      content: obj[0].Content,
      commentatorInfo: {
        userId: obj[0].CommentatorId,
        userLogin: obj[0].CommentatorLogin,
      },
      createdAt: obj[0].CreatedAt,
      likesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
      },
    };
  }

  async mapCommentsForBlogger(
    objs: CommentsViewForBloggerDto[] | CommentDocument[],
    userId?: string,
  ): Promise<CommentsViewForBloggerDto[]> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';
    return await Promise.all(
      objs.map(async (el) => {
        const commentId = el._id.toString();
        const allLikes = await this.likesRepo.countAllLikesForComment(
          commentId,
        );
        const allDislikes = await this.likesRepo.countAllDislikesForComment(
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
          id: el._id,
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
          postInfo: {
            id: el.postInfo.id,
            title: el.postInfo.title,
            blogId: el.postInfo.blogId,
            blogName: el.postInfo.blogName,
          },
        };
      }),
    );
  }

  async mapComments(
    objs: any,
    userId?: string | null,
  ): Promise<CommentViewModel[]> {
    let like: LikeDocument | null;
    let userStatus: string | undefined = 'None';

    return await Promise.all(
      objs.map(async (el) => {
        const commentId = el.Id.toString();
        const allLikes = await this.likesRepo.countAllLikesForComment(
          commentId,
        );
        const allDislikes = await this.likesRepo.countAllDislikesForComment(
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
          id: el.Id.toString(),
          content: el.content,
          commentatorInfo: {
            userId: el.CommentatorId,
            userLogin: el.CommentatorLogin,
          },
          createdAt: el.CreatedAt,
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
