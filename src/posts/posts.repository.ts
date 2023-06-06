import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from './schemas/posts.database.schema';
import { PostBodyBlogId } from './dto/post.body.blogId';
import { BlogDocument } from '../blogs/schemas/blogs.database.schema';
import { PostCreationDto } from './dto/post.creation.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModelType,
  ) {}
  async createOne(
    postDto: PostCreationDto,
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

  async deleteOnePostBySpecificBlogId(postId: string, blogId: string) {
    const result = await this.postModel.deleteOne({
      $and: [{ _id: postId }, { blogId: blogId }],
    });
    return result.deletedCount === 1;
  }

  async updateBanStatusForPostByOwnerId(userId: string, banStatus: boolean) {
    return this.postModel.updateMany(
      { 'ownerInfo.userId': userId },
      { $set: { isUserBanned: banStatus } },
    );
  }
}
