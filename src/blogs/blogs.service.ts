import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogBody } from './dto/blog.body';
import { BlogDocument } from './schemas/blogs.database.schema';

@Injectable()
export class BlogService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createOneBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<any | null> {
    const blogDto: BlogBody = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    return await this.blogsRepository.createOne(blogDto);
  }

  async updateOneBlog(
    blog: BlogDocument,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const blogBody = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    return await this.blogsRepository.updateOne(blog, blogBody);
  }

  async deleteOneBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteOne(id);
  }
}
