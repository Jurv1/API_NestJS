import { Injectable } from '@nestjs/common';
import { BlogQ } from '../blogs/blogs.query.repository';
import { PostsRepository } from './posts.repository';
import { BlogDocument } from '../blogs/schemas/blogs.database.schema';
import { PostQ } from './posts.query.repository';
import { postUpdateBody } from './dto/post.update.body';
import { PostDocument } from './schemas/posts.database.schema';
import { Errors } from '../utils/handle.error';

@Injectable()
export class PostService {
  constructor(
    protected readonly blogQ: BlogQ,
    protected readonly postsRepository: PostsRepository,
    protected readonly postQ: PostQ,
  ) {}
  async createOnePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostDocument | null> {
    const foundedEl: BlogDocument = await this.blogQ.getOneBlog(blogId);

    if (foundedEl) {
      const blogName: string = foundedEl.name;
      const postDto = {
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
        blogName: blogName,
      };
      return await this.postsRepository.createOne(postDto, foundedEl);
    } else {
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'No such blog',
            field: 'blogId',
          },
        ],
      });
    }
  }

  async updateOnePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const foundedPost: PostDocument = await this.postQ.getOnePost(id);

    if (!foundedPost) return false;
    const postUpdateBody: postUpdateBody = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    await foundedPost.updatePost(postUpdateBody);
    await foundedPost.save();

    return true;
  }

  async deleteOnePost(id: string): Promise<boolean> {
    return await this.postsRepository.deleteOne(id);
  }
}
