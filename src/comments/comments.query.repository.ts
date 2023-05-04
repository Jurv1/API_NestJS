import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, DBComment } from './schemas/comments.database.schema';

@Injectable()
export class CommentQ {
  constructor(
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async getOneComment(id: string): Promise<any | null> {
    const result = await this.commentModel.findById({ _id: id });

    return {
      id: result._id.toString(),
      content: result.content,
      commentatorInfo: {
        userId: result.commentatorInfo.userId,
        userLogin: result.commentatorInfo.userLogin,
      },
      createdAt: result.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
}
