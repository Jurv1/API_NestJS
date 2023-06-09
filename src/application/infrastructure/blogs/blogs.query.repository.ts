import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
} from '../../schemas/blogs/schemas/blogs.database.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { BlogWithPaginationDto } from '../../dto/blogs/dto/blog.with.pagination.dto';

@Injectable()
export class BlogQ {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getAllBlogs(
    filter: FilterQuery<BlogDocument>,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<BlogWithPaginationDto> {
    const allBlogs: BlogDocument[] = await this.blogModel
      .find(filter)
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();

    const countDocs = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(countDocs / pagination['pageSize']);

    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDocs,
      items: allBlogs,
    };
  }

  async getAllBlogsForBlogger(
    filter: FilterQuery<BlogDocument>,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {
    const allBlogs: BlogDocument[] = await this.blogModel
      .find(filter)
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();

    const countDocs = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(countDocs / pagination['pageSize']);

    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDocs,
      items: allBlogs,
    };
  }

  async getOneBlog(id: string): Promise<any | null> {
    return this.blogModel.findOne({ _id: id });
  }
}
