import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostQ } from '../../../application/infrastructure/posts/posts.query.repository';
import { JwtService } from '@nestjs/jwt';
import { PostMapper } from '../../../application/utils/mappers/post.mapper';
import { PostQuery } from '../../../application/dto/posts/dto/post.query';
import { queryValidator } from '../../../application/utils/sorts/_MongoSorts/sorting.func';
import { filterQueryValid } from '../../../application/utils/sorts/_MongoSorts/query.validator';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { PostDocument } from '../../../application/schemas/posts/schemas/posts.database.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContentDto } from '../../../application/dto/comments/dto/content.dto';
import { CurrentUserIdAndLogin } from '../auth/decorators/current-user.id.and.login';
import { UserIdAndLogin } from '../auth/dto/user-id.and.login';
import { LikeBody } from '../../../application/dto/likes/dto/like.body';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentForPostCommand } from './use-cases/create.comment.for.post.use-case';
import { LikeCommentOrPostCommand } from '../comments.public/use-cases/like.comment.use-case';
import { BlogQ } from '../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';

@Controller('posts')
export class PublicPostController {
  constructor(
    protected postQ: PostQ,
    private readonly blogQ: BlogQ,
    private readonly jwtService: JwtService,
    private readonly postMapper: PostMapper,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAll(@Query() query: PostQuery, @Req() req: any) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const sort = queryValidator(sortBy, sortDirection);
    const filter = filterQueryValid(searchNameTerm);
    const pagination = makePagination(pageNumber, pageSize);

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
      return await this.postQ.getAllPosts(filter, sort, pagination, userId);
    } catch (err) {
      console.log(err);
      throw new Errors.BAD_REQUEST();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: any) {
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

      const result: PostDocument = await this.postQ.getOnePost(id);
      if (result) {
        const blog = await this.blogQ.getOneBlog(result.blogId);
        if (!blog) throw new Errors.NOT_FOUND();
        return await this.postMapper.mapPost(result, userId);
      } else {
        throw new Errors.NOT_FOUND();
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
    @Req() req: any,
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

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
      const allComments = await this.postQ.getAllCommentsByPostId(
        id,
        sort,
        pagination,
        userId,
      );
      if (allComments.items.length !== 0) return allComments;
      throw new Errors.NOT_FOUND();
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
    const content: string = body.content;
    const userId: string = user.userId;
    const userLogin: string = user.userLogin;

    return await this.commandBus.execute(
      new CreateCommentForPostCommand(postId, content, userId, userLogin),
    );
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

    return await this.commandBus.execute(
      new LikeCommentOrPostCommand(id, likeStatus, userId, userLogin, 'post'),
    );
  }
}
