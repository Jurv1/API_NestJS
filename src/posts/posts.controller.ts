import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { queryValidator } from 'src/utils/sorting.func';
import { makePagination } from '../utils/make.paggination';
import { filterQueryValid } from '../utils/query.validator';
import { PostService } from './posts.service';
import { PostQ } from './posts.query.repository';
import { Errors } from '../utils/handle.error';
import { PostBodyBlogId } from './dto/post.body.blogId';
import { PostQuery } from './dto/post.query';
import { PostDocument } from './schemas/posts.database.schema';
import { PostBody } from './dto/post.body.without.blogId';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CurrentUserIdAndLogin } from '../auth/current-user.id.and.login';
import { UserIdAndLogin } from '../auth/dto/user-id.and.login';
import { LikesRepository } from '../likes/likes.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentDocument } from '../comments/schemas/comments.database.schema';
import { ContentDto } from '../comments/dto/content.dto';
import { LikeBody } from '../likes/dto/like.body';
import { CurrentUserAccessToken } from '../auth/current-user.access.token';
import { JwtService } from '@nestjs/jwt';
import { PostMapper } from '../utils/mappers/post.mapper';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    protected postQ: PostQ,
    private readonly likesRepo: LikesRepository,
    private readonly jwtService: JwtService,
    private readonly postMapper: PostMapper,
  ) {}

  @Get()
  async getAll(
    @Query() query: PostQuery,
    @CurrentUserAccessToken() token: string,
  ) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const sort = queryValidator(sortBy, sortDirection);
    const filter = filterQueryValid(searchNameTerm);
    const pagination = makePagination(pageNumber, pageSize);

    let userId = null;

    try {
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }
      return await this.postQ.getAllPosts(filter, sort, pagination, userId);
    } catch (err) {
      console.log(err);
      throw new Errors.BAD_REQUEST();
    }
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @CurrentUserAccessToken() token: string,
  ) {
    let userId = null;
    try {
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }

      const result: PostDocument = await this.postQ.getOnePost(id);
      if (result) {
        return await this.postMapper.mapPost(result, userId);
      } else {
        return new Errors.NOT_FOUND();
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Get(':id/comments')
  async getAllCommentsByPostId(
    @Query() query: PostQuery,
    @Param('id') id: string,
    @CurrentUserAccessToken() token: string,
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

    let userId = null;

    try {
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }
      const allComments = await this.postQ.getAllCommentsByPostId(
        id,
        sort,
        pagination,
        userId,
      );
      if (allComments) return allComments;
      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  async createOne(@Body() body: PostBodyBlogId) {
    try {
      const { title, shortDescription, content, blogId } = body;
      const result: PostDocument | null = await this.postService.createOnePost(
        title,
        shortDescription,
        content,
        blogId,
      );

      if (result) {
        return {
          id: result._id.toString(),
          title: result.title,
          shortDescription: result.shortDescription,
          content: result.content,
          blogId: result.blogId,
          blogName: result.blogName,
          extendedLikesInfo: {
            likesCount: result.extendedLikesInfo.likesCount,
            dislikesCount: result.extendedLikesInfo.dislikesCount,
            myStatus: result.extendedLikesInfo.myStatus,
            newestLikes: [],
          },
          createdAt: result.createdAt,
        };
      }

      return new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() body: PostBodyBlogId) {
    try {
      const { title, shortDescription, content, blogId } = body;
      const result = await this.postService.updateOnePost(
        id,
        title,
        shortDescription,
        content,
        blogId,
      );
      if (!result) {
        throw new Errors.NOT_FOUND();
      }
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      const result = await this.postService.deleteOnePost(id);
      if (!result) throw new Errors.NOT_FOUND();
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createOneCommentByPostId(
    @Param('id') postId: string,
    @Body() body: ContentDto,
    @CurrentUserIdAndLogin() user: UserIdAndLogin,
  ) {
    const content = body.content;
    const userId = user.userId;
    const userLogin = user.userLogin;

    try {
      const result: CommentDocument =
        await this.postService.createOneCommentByPostId(
          postId,
          content,
          userId,
          userLogin,
        );

      if (result) {
        return {
          id: result.id,
          content: result.content,
          commentatorInfo: {
            userId: result.commentatorInfo.userId,
            userLogin: result.commentatorInfo.userLogin,
          },
          createdAt: result.createdAt,
          likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
          },
        };
      }

      return new Errors.NOT_FOUND({
        errorsMessages: [
          {
            message: 'No such post',
            field: 'postId',
          },
        ],
      });
    } catch (err) {
      console.log(err);
      return new Errors.NOT_FOUND();
    }
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async likePost(
    @Param('id') id: string,
    @Body() body: LikeBody,
    @CurrentUserIdAndLogin() user: UserIdAndLogin,
  ) {
    const likeStatus = body.likeStatus;
    const userId = user.userId;
    const userLogin = user.userLogin;

    try {
      const post = await this.postQ.getOnePost(id);
      if (!post) {
        throw new Errors.NOT_FOUND();
      }
      const userStatus = await this.likesRepo.getUserStatusForComment(
        userId,
        id,
      );
      if (likeStatus === 'None') {
        const result = await this.likesRepo.deleteLikeDislike(
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
          await this.likesRepo.deleteLikeDislike(
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
          await this.likesRepo.deleteLikeDislike(
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
