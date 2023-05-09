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

@Controller('posts')
export class PostController {
  constructor(protected postService: PostService, protected postQ: PostQ) {}

  @Get()
  async getAll(@Query() query: PostQuery) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const sort = queryValidator(sortBy, sortDirection);
    const filter = filterQueryValid(searchNameTerm);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      return await this.postQ.getAllPosts(filter, sort, pagination);
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const result = await this.postQ.getOnePost(id);
      if (result) {
        return {
          id: result.id.toString(),
          title: result.title,
          shortDescription: result.shortDescription,
          content: result.content,
          blogId: result.blogId,
          blogName: result.blogName,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
          createdAt: result.createdAt,
        };
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
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      const allComments = await this.postQ.getAllCommentsByPostId(
        id,
        sort,
        pagination,
      );
      if (allComments) return allComments;
      return new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Post()
  async createOne(@Body() body: PostBody) {
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
}
