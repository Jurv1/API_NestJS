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
import { BlogQ } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { JwtService } from '@nestjs/jwt';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { queryValidator } from '../../../application/utils/sorts/_MongoSorts/sorting.func';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { BlogBody } from '../../../application/dto/blogs/dto/body/blog.body';
import { PostBody } from '../../../application/dto/posts/dto/post.body.without.blogId';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './use-cases/create.blog.use-case';
import { CreatePostForBlogCommand } from './use-cases/create.post.for.blog.use-case';
import { UpdateBlogCommand } from './use-cases/update.blog.use-case';
import { DeleteOneBlogCommand } from './use-cases/delete.one.blog.use-case';
import { JwtAuthGuard } from '../../_public/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../_public/auth/decorators/current-user.param.decorator';
import { CurrentUserIdAndLogin } from '../../_public/auth/decorators/current-user.id.and.login';
import { UserIdAndLogin } from '../../_public/auth/dto/user-id.and.login';
import { UpdatePostByBlogIdCommand } from './use-cases/update.post.by.blog.id.use-case';
import { DeleteOnePostBySpecificBlogIdCommand } from './use-cases/delete.one.post.by.specific.blog.id.use-case';
import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../../application/schemas/blogs/schemas/blogs.database.schema';
import { filterForBlogger } from '../../../application/utils/filters/_MongoFilters/filter.for.blogger';
import { BlogWithPaginationDto } from '../../../application/dto/blogs/dto/view/blog.with.pagination.dto';
import { BlogMapper } from '../../../application/utils/mappers/blog.mapper';
import { BlogQueryForComments } from '../../../application/dto/blogs/dto/queries/blog.query.for.comments';
import { CommentQ } from '../../../application/infrastructure/comments/comments.query.repository';
import { CommentsWithPagination } from '../../../application/dto/comments/dto/comments.with.pagination';
import { CommentMapper } from '../../../application/utils/mappers/comment.mapper';

@Controller('blogger/blogs')
export class BloggerBlogController {
  constructor(
    protected blogQ: BlogQ,
    private readonly commentQ: CommentQ,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
    private readonly blogMapper: BlogMapper,
    private readonly commentMapper: CommentMapper,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query() query?: BlogQueryParams,
    @CurrentUserId() userId?: string,
  ) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter: FilterQuery<BlogDocument> = filterForBlogger(
      searchNameTerm,
      userId,
    );
    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      const blogsWithPag: BlogWithPaginationDto =
        await this.blogQ.getAllBlogsForBlogger(filter, sort, pagination);
      blogsWithPag.items = this.blogMapper.mapBlogs(blogsWithPag.items);
      return blogsWithPag;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('comments')
  async getAllCommentsForBlog(
    @Query() query: BlogQueryForComments,
    @CurrentUserId() userId: string,
  ) {
    const sort = queryValidator(query.sortBy, query.sortDirection);
    const pagination = makePagination(query.pageNumber, query.pageSize);
    const comments: CommentsWithPagination =
      await this.commentQ.getCommentsForBlog(userId, sort, pagination);
    comments.items = await this.commentMapper.mapCommentsForBlogger(
      comments.items,
      userId,
    );
    return comments;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(
    @Body() body: BlogBody,
    @CurrentUserIdAndLogin() userData: UserIdAndLogin,
  ) {
    const { name, description, websiteUrl } = body;

    return await this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl, userData),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/posts')
  async createOneByBlogId(
    @Param('id') id: string,
    @CurrentUserIdAndLogin() userData: UserIdAndLogin,
    @Body() body: PostBody,
  ) {
    const { title, shortDescription, content } = body;
    return await this.commandBus.execute(
      new CreatePostForBlogCommand(
        title,
        shortDescription,
        content,
        id,
        userData,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() body: BlogBody,
  ) {
    const { name, description, websiteUrl } = body;
    return await this.commandBus.execute(
      new UpdateBlogCommand(id, name, description, websiteUrl, userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/posts/:postId')
  async updatePostByBlogId(
    @Param('id') id: string,
    @Param('postId') postId: string,
    @CurrentUserId() userId: string,
    @Body() body: PostBody,
  ) {
    const { title, shortDescription, content } = body;
    return await this.commandBus.execute(
      new UpdatePostByBlogIdCommand(
        id,
        postId,
        title,
        shortDescription,
        content,
        userId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id/posts/:postId')
  async deleteOnePostBySpecificBlogId(
    @Param('id') id: string,
    @Param('postId') postId: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.commandBus.execute(
      new DeleteOnePostBySpecificBlogIdCommand(id, postId, userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    return await this.commandBus.execute(new DeleteOneBlogCommand(id, userId));
  }
}
