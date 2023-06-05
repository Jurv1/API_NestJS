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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from '../../../blogs/blogs.service';
import { BlogQ } from '../../../blogs/blogs.query.repository';
import { PostService } from '../../../posts/posts.service';
import { PostQ } from '../../../posts/posts.query.repository';
import { JwtService } from '@nestjs/jwt';
import { BlogQueryParams } from '../../../blogs/dto/blog.query.params';
import { filterQueryValid } from '../../../utils/query.validator';
import { queryValidator } from '../../../utils/sorting.func';
import { makePagination } from '../../../utils/make.paggination';
import { Errors } from '../../../utils/handle.error';
import { PostQuery } from '../../../posts/dto/post.query';

@Controller('blogs')
export class PublicBlogController {
  constructor(
    protected blogQ: BlogQ,
    protected postQ: PostQ,
    private readonly jwtService: JwtService,
  ) {}
  @Get()
  async getAll(@Query() query?: BlogQueryParams) {
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

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const result = await this.blogQ.getOneBlog(id);
      if (result) {
        return {
          id: result._id.toString(),
          name: result.name,
          description: result.description,
          websiteUrl: result.websiteUrl,
          isMembership: result.isMembership,
          createdAt: result.createdAt,
        };
      }
      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @Query() query: PostQuery,
    @Req() req: any,
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);
    let userId = null;

    try {
      const blog = await this.blogQ.getOneBlog(id);
      if (!blog) throw new Errors.NOT_FOUND();
      const token = req.headers.authorization.split(' ')[1];
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }
      return await this.postQ.getAllPostsByBlogId(id, sort, pagination, userId);
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
