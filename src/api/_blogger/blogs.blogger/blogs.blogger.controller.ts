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
import { JwtService } from '@nestjs/jwt';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { makePagination } from '../../../application/utils/make.paggination';
import { BlogBody } from '../../../application/dto/blogs/dto/body/blog.body';
import { PostBody } from '../../../application/dto/posts/dto/post.body.without.blogId';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './use-cases/command.use-cases/create.blog.use-case';
import { CreatePostForBlogCommand } from './use-cases/command.use-cases/create.post.for.blog.use-case';
import { UpdateBlogCommand } from './use-cases/command.use-cases/update.blog.use-case';
import { DeleteOneBlogCommand } from './use-cases/command.use-cases/delete.one.blog.use-case';
import { JwtAuthGuard } from '../../_public/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../_public/auth/decorators/current-user.param.decorator';
import { CurrentUserIdAndLogin } from '../../_public/auth/decorators/current-user.id.and.login';
import { UserIdAndLogin } from '../../_public/auth/dto/user-id.and.login';
import { UpdatePostByBlogIdCommand } from './use-cases/command.use-cases/update.post.by.blog.id.use-case';
import { DeleteOnePostBySpecificBlogIdCommand } from './use-cases/command.use-cases/delete.one.post.by.specific.blog.id.use-case';
import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogQueryForComments } from '../../../application/dto/blogs/dto/queries/blog.query.for.comments';
import { filterForPublicBlogs } from '../../../application/utils/filters/filter.for.public.blogs';
import { GetAllBlogsForBloggerQueryCommand } from './use-cases/query.use-cases/get.all.blogs.for.blogger.query.use-case';
import { ultimateSort } from '../../../application/utils/sorts/ultimate.sort';
import { EnumForBlogs } from '../../../application/enums/emun.for.blogs';
import { CommentsQueryRepository } from '../../../application/infrastructure/comments/comments.query.repository';
import { EnumForComments } from '../../../application/enums/enum.for.comments';
import { GetAllCommentsForBloggerQueryCommand } from './use-cases/query.use-cases/get.all.comments.for.blogger.query.use-case';

@Controller('blogger/blogs')
export class BloggerBlogController {
  constructor(
    private readonly commentQ: CommentsQueryRepository,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query() query?: BlogQueryParams,
    @CurrentUserId() userId?: string,
  ) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter: FilterQuery<BlogDocument> =
      filterForPublicBlogs(searchNameTerm);
    const sort: { [key: string]: string } = ultimateSort(
      sortBy,
      sortDirection,
      EnumForBlogs,
    );
    const pagination = makePagination(pageNumber, pageSize);

    return await this.queryBus.execute(
      new GetAllBlogsForBloggerQueryCommand(filter, sort, pagination, userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('comments')
  async getAllCommentsForBlog(
    @Query() query: BlogQueryForComments,
    @CurrentUserId() userId: string,
  ) {
    const sort = ultimateSort(
      query.sortBy,
      query.sortDirection,
      EnumForComments,
    );
    const pagination = makePagination(query.pageNumber, query.pageSize);
    return await this.queryBus.execute(
      new GetAllCommentsForBloggerQueryCommand(userId, sort, pagination),
    );
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
