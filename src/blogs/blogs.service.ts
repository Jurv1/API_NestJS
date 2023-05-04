import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createOneBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<any | null> {
    const newBlogTmp = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return await this.blogsRepository.createOne(newBlogTmp);
  }

  async updateOneBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    return await this.blogsRepository.updateOne(
      id,
      name,
      description,
      websiteUrl,
    );
  }

  async deleteOneBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteOne(id);
  }
}
