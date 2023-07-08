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
    const commentId = obj[0].id.toString();
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
      userStatus = like[0]?.LikeStatus;
    }
    return {
      id: obj[0].id.toString(),
      content: obj[0].content,
      commentatorInfo: {
        userId: obj[0].commentatorId.toString(),
        userLogin: obj[0].commentatorLogin,
      },
      createdAt: obj[0].createdAt,
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
        const commentId = el.id.toString();
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
          userStatus = like[0]?.LikeStatus;
        }
        return {
          id: el.id.toString(),
          content: el.content,
          commentatorInfo: {
            userId: el.commentatorId.toString(),
            userLogin: el.commentatorlogin,
          },
          createdAt: el.createdAt,
          likesInfo: {
            likesCount: allLikes,
            dislikesCount: allDislikes,
            myStatus: userStatus || 'None',
          },
          postInfo: {
            id: el.postid.toString(),
            title: el.title,
            blogId: el.blogId.toString(),
            blogName: el.blogName,
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
        const commentId = el.id.toString();
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
          userStatus = like[0]?.LikeStatus;
        }

        return {
          id: el.id.toString(),
          content: el.content,
          commentatorInfo: {
            userId: el.commentatorId.toString(),
            userLogin: el.commentatorLogin,
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
