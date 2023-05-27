import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesRepository } from '../likes/likes.repository';
import { CommentService } from './comments.service';
import { CommentQ } from './comments.query.repository';
import { Errors } from '../utils/handle.error';
import { CurrentUserIdAndLogin } from '../auth/current-user.id.and.login';
import { UserIdAndLogin } from '../auth/dto/user-id.and.login';
import { CommentDocument } from './schemas/comments.database.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContentDto } from './dto/content.dto';
import { LikeBody } from '../likes/dto/like.body';
import { JwtService } from '@nestjs/jwt';
import { CommentMapper } from '../utils/mappers/comment.mapper';
import { CurrentUserId } from '../auth/current-user.param.decorator';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentQ: CommentQ,
    private readonly commentService: CommentService,
    private readonly likesRepo: LikesRepository,
    private readonly jwtService: JwtService,
    private readonly commentMapper: CommentMapper,
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: string, @Req() req: any) {
    let userId = null;
    let token;
    try {
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      }
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }
      const result = await this.commentQ.getOneComment(id);

      if (result) {
        return await this.commentMapper.mapComment(result, userId);
      } else {
        throw new Errors.NOT_FOUND();
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateOneById(
    @Param('id') id: string,
    @Body() body: ContentDto,
    @CurrentUserId() userId: string,
  ) {
    const content = body.content;
    try {
      const comment: CommentDocument = await this.commentQ.getOneComment(id);
      if (!comment) {
        throw new Errors.NOT_FOUND();
      }
      if (comment.commentatorInfo.userId !== userId) {
        throw new Errors.FORBIDDEN();
      }
      await comment.updateComment(content);
      await comment.save();
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteOneById(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    try {
      const comment: CommentDocument = await this.commentQ.getOneComment(id);
      if (comment.commentatorInfo.userId !== userId) {
        throw new Errors.FORBIDDEN();
      }
      const result = await this.commentService.deleteOneCommentById(id);
      if (!result) throw new Errors.NOT_FOUND();
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async likeComment(
    @Param('id') id: string,
    @Body() body: LikeBody,
    @CurrentUserIdAndLogin() user: UserIdAndLogin,
  ) {
    const likeStatus: string = body.likeStatus;
    const userId: string = user.userId;
    const userLogin: string = user.userLogin;

    try {
      const comment = await this.commentQ.getOneComment(id);
      if (!comment) {
        throw new Errors.NOT_FOUND();
      }
      const userStatus = await this.likesRepo.getUserStatusForComment(
        userId,
        id,
      );
      if (likeStatus === 'None') {
        const result = await this.commentService.deleteLikeDislike(
          userId,
          id,
          userStatus?.userStatus,
        );
        if (result) {
          return;
        }
        throw new Errors.NOT_FOUND();
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
          throw new Errors.NOT_FOUND();
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
          throw new Errors.NOT_FOUND();
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
          throw new Errors.NOT_FOUND();
        }
      }

      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
