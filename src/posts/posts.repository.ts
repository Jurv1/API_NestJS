import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from './schemas/posts.database.schema';
import { PostBodyBlogId } from './dto/post.body.blogId';
import { BlogDocument } from '../blogs/schemas/blogs.database.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModelType,
  ) {}
  async createOne(
    postDto: PostBodyBlogId,
    blog: BlogDocument,
  ): Promise<PostDocument | null> {
    const createdPost: PostDocument = await this.postModel.createPostWithBlogId(
      postDto,
      blog,
      this.postModel,
    );
    await createdPost.save();
    return createdPost;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
