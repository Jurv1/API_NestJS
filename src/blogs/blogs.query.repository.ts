import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blogs.database.schema';
import { Model, SortOrder } from 'mongoose';

@Injectable()
export class BlogQ {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getAllBlogs(
    filter: Document,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<any> {
    const allBlogs = await this.blogModel
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
      items: allBlogs.map((el) => {
        return {
          id: el._id.toString(),
          name: el.name,
          description: el.description,
          websiteUrl: el.websiteUrl,
          isMembership: el.isMembership,
          createdAt: el.createdAt,
        };
      }),
    };
  }

  async getOneBlog(id: string): Promise<any | null> {
    return this.blogModel.findOne({ _id: id });
  }
}
