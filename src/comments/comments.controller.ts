import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { LikesRepository } from '../likes/likes.repository';
import { CommentService } from './comments.service';
import { CommentQ } from './comments.query.repository';
import { Errors } from '../utils/handle.error';
import { CurrentUserId } from '../auth/current-user.param.decorator';
import { CurrentUserIdAndLogin } from '../auth/current-user.id.and.login';
import { UserIdAndLogin } from '../auth/dto/user-id.and.login';
import { CommentDocument } from './schemas/comments.database.schema';

@Controller('comments')
export class CommentController {
  constructor(
    protected commentQ: CommentQ,
    protected commentService: CommentService,
    protected likesRepo: LikesRepository,
  ) {}
  @Get(':id')
  async getOneById(@Param('id') id: string, @CurrentUserId() userId: string) {
    try {
      const result = await this.commentQ.getOneComment(id, userId);

      if (result) {
        return result;
      } else {
        throw new Errors.NOT_FOUND();
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Put('id')
  async updateOneById(@Param('id') id: string, @Body() body) {
    const content = body.content;
    try {
      const comment: CommentDocument = await this.commentQ.getOneComment(id);
      if (!comment) {
        throw new Errors.NOT_FOUND();
      }
      await comment.updateComment(content);
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Delete(':id')
  async deleteOneById(@Param('id') id: string) {
    try {
      const result = await this.commentService.deleteOneCommentById(id);
      if (!result) throw new Errors.NOT_FOUND();
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Put(':id/like-status')
  async likeComment(
    @Param('id') id: string,
    @Body() body,
    @CurrentUserIdAndLogin() user: UserIdAndLogin,
  ) {
    const likeStatus = body.likeStatus;
    const userId: string = user.userId;
    const userLogin: string = user.userLogin;

    try {
      const userStatus = await this.likesRepo.getUserStatusForComment(
        userId,
        id,
      );
      if (likeStatus === 'None') {
        const result = await this.commentService.deleteLikeDislike(
          userId,
          id,
          userStatus!.userStatus,
        );
        if (result) {
          return;
        }
        return new Errors.NOT_FOUND();
      }
      if (likeStatus === 'Like') {
        if (userStatus?.userStatus === 'Dislike') {
          //remove dislike and create like
          await this.commentService.deleteLikeDislike(
            userId,
            id,
            userStatus.userStatus,
          );
          return;
        } else if (userStatus?.userStatus === 'Like') {
          return;
        } else {
          const result = await this.likesRepo.likePostOrComment(
            id,
            likeStatus,
            userId,
            userLogin,
          );
          if (result) {
            return;
          }
          return new Errors.NOT_FOUND();
        }
      }
      if (likeStatus === 'Dislike') {
        if (userStatus?.userStatus === 'Like') {
          await this.commentService.deleteLikeDislike(
            userId,
            id,
            userStatus.userStatus,
          );
          const result = await this.likesRepo.likePostOrComment(
            id,
            likeStatus,
            userId,
            userLogin,
          );
          if (result) {
            return;
          }
          return new Errors.NOT_FOUND();
          //remove like and create dislike
        } else if (userStatus?.userStatus === 'Dislike') {
          return;
        } else {
          //create Dislike
          const result = await this.likesRepo.likePostOrComment(
            id,
            likeStatus,
            userId,
            userLogin,
          );
          if (result) {
            return;
          }
          return new Errors.NOT_FOUND();
        }
      }

      return new Errors.NOT_FOUND();
    } catch (err) {}
  }
}
