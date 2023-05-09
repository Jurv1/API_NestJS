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
} from '@nestjs/common';
import { BlogService } from './blogs.service';
import { BlogQ } from './blogs.query.repository';
import { filterQueryValid } from '../utils/query.validator';
import { queryValidator } from '../utils/sorting.func';
import { makePagination } from '../utils/make.paggination';
import { Errors } from '../utils/handle.error';
import { BlogBody } from './dto/blog.body';
import { BlogQueryParams } from './dto/blog.query.params';
import { PostService } from '../posts/posts.service';
import { PostQuery } from '../posts/dto/post.query';
import { PostQ } from '../posts/posts.query.repository';
import { BlogDocument } from './schemas/blogs.database.schema';
import { PostBody } from '../posts/dto/post.body.without.blogId';

@Controller('blogs')
export class BlogController {
  constructor(
    protected blogService: BlogService,
    protected blogQ: BlogQ,
    protected postService: PostService,
    protected postQ: PostQ,
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
  async getPostsByBlogId(@Param('id') id: string, @Query() query: PostQuery) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      const blog = await this.blogQ.getOneBlog(id);
      if (!blog) throw new Errors.NOT_FOUND();
      return await this.postQ.getAllPostsByBlogId(id, sort, pagination);
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Post()
  async createOne(@Body() body: BlogBody) {
    const { name, description, websiteUrl } = body;

    try {
      const result: BlogDocument = await this.blogService.createOneBlog(
        name,
        description,
        websiteUrl,
      );
      if (result) {
        return {
          id: result.id.toString(),
          name: result.name,
          description: result.description,
          websiteUrl: result.websiteUrl,
          isMembership: result.isMembership,
          createdAt: result.createdAt,
        };
      } else {
        throw new Errors.NOT_FOUND();
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
  @Post(':id/posts')
  async createOneByBlogId(@Param('id') id: string, @Body() body: PostBody) {
    const { title, shortDescription, content } = body;
    try {
      const result = await this.postService.createOnePost(
        title,
        shortDescription,
        content,
        id,
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

      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @HttpCode(204)
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() body: BlogBody) {
    const { name, description, websiteUrl } = body;

    try {
      const foundedBlog: BlogDocument = await this.blogQ.getOneBlog(id);
      const result = await this.blogService.updateOneBlog(
        foundedBlog,
        name,
        description,
        websiteUrl,
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

  @HttpCode(204)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      const result = await this.blogService.deleteOneBlog(id);
      if (!result) throw new Errors.NOT_FOUND();
      return;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
