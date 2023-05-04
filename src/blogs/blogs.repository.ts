import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blogs.database.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async createOne(newBlogTmp: any): Promise<any | null> {
    const createdBlog = new this.blogModel(newBlogTmp);
    await createdBlog.save();
    return {
      id: createdBlog._id,
      name: newBlogTmp.name,
      description: newBlogTmp.description,
      websiteUrl: newBlogTmp.websiteUrl,
      createdAt: newBlogTmp.createdAt,
      isMembership: newBlogTmp.isMembership,
    };
  }

  async updateOne(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const updatedEl = await this.blogModel.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      },
    );
    return updatedEl.matchedCount === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
