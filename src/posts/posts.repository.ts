import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/posts.database.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async createOne(newPostTmp: any): Promise<any | null> {
    const resultId = await this.postModel.create(newPostTmp);
    return this.postModel.findOne({ _id: resultId._id });
  }

  async updateOne(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const updatedEl = await this.postModel.updateOne(
      { _id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      },
    );
    return updatedEl.matchedCount === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
