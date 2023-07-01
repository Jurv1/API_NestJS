import { Injectable } from '@nestjs/common';
import { BlogCreationDto } from '../../dto/blogs/dto/blog.creation.dto';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createOneBlog(
    name: string,
    description: string,
    websiteUrl: string,
    userId: string,
    userLogin: string,
  ): Promise<any | null> {
    const blogDto: BlogCreationDto = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      userId: userId,
      userLogin: userLogin,
    };
    return await this.blogsRepository.createOne(blogDto);
  }

  async updateOneBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const blogBody = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    return await this.blogsRepository.updateOne(blogId, blogBody);
  }

  async updateBanInfoForBlog(blogId: string, isBanned: boolean) {
    let date;
    isBanned ? (date = new Date().toISOString()) : (date = null);
    await this.blogsRepository.updateBanInfoForBlogs(blogId, date, isBanned);
    if (isBanned) {
      await this.blogsRepository.addBlogToBan(blogId);
    } else {
      return await this.blogsRepository.removeBlogToBan(blogId);
    }
  }

  async bindUser(userId: number, userLogin: string, blogId: number) {
    return await this.blogsRepository.bindUser(userId, userLogin, blogId);
  }

  async deleteOneBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteOne(id);
  }
}
