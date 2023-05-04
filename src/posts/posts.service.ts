import { Injectable } from '@nestjs/common';
import { BlogQ } from '../blogs/blogs.query.repository';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostService {
  constructor(
    protected blogQ: BlogQ,
    protected postsRepository: PostsRepository,
  ) {}
  async createOnePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<any | null> {
    const foundedEl = await this.blogQ.getOneBlog(blogId);

    if (foundedEl) {
      const blogName = foundedEl.name;
      const newPostTmp = {
        title: title.toString(),
        shortDescription: shortDescription.toString(),
        content: content,
        blogId: blogId,
        blogName: blogName,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
        createdAt: new Date().toISOString(),
      };
      return await this.postsRepository.createOne(newPostTmp);
      //return await postDBController.findOne({id: id}, {projection: {_id: 0}})
    } else {
      return null;
    }
  }

  async createOnePostByBlogId(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<any | null> {
    const foundedEl = await this.blogQ.getOneBlog(blogId);
    if (foundedEl) {
      const blogName = foundedEl.name;
      const newPostTmp = {
        title: title.toString(),
        shortDescription: shortDescription.toString(),
        content: content,
        blogId: blogId,
        blogName: blogName,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
        createdAt: new Date().toISOString(),
      };
      return await this.postsRepository.createOne(newPostTmp);
    } else {
      return null;
    }
  }

  async updateOnePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    return await this.postsRepository.updateOne(
      id,
      title,
      shortDescription,
      content,
      blogId,
    );
  }

  async deleteOnePost(id: string): Promise<boolean> {
    return await this.postsRepository.deleteOne(id);
  }
}
