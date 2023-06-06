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
import { BlogQueryParams } from '../../../application/dto/blogs/dto/blog.query.params';
import { filterQueryValid } from '../../../application/utils/query.validator';
import { queryValidator } from '../../../application/utils/sorting.func';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { BlogBody } from '../../../application/dto/blogs/dto/blog.body';
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

@Controller('_blogger/blogs')
export class BloggerBlogController {
  constructor(
    protected blogQ: BlogQ,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query() query?: BlogQueryParams,
    @CurrentUserId() userId?: string,
  ) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = filterQueryValid(searchNameTerm);
    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      return await this.blogQ.getAllBlogs(filter, sort, pagination);
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(
    @Body() body: BlogBody,
    @CurrentUserIdAndLogin() userData: UserIdAndLogin,
  ) {
    const { name, description, websiteUrl } = body;

    await this.commandBus.execute(
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
  async updateOne(@Param('id') id: string, @Body() body: BlogBody) {
    const { name, description, websiteUrl } = body;
    return await this.commandBus.execute(
      new UpdateBlogCommand(id, name, description, websiteUrl),
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
  async deleteOne(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteOneBlogCommand(id));
  }
}
