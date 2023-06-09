import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentModelType,
  DBComment,
} from '../../schemas/comments/schemas/comments.database.schema';

@Injectable()
export class CommentQ {
  constructor(
    @InjectModel(DBComment.name) private commentModel: CommentModelType,
  ) {}
  async getOneComment(id: string): Promise<any | null> {
    return this.commentModel.findOne({
      $and: [
        {
          _id: id,
        },
        { isUserBanned: false },
      ],
    });
  }
}
