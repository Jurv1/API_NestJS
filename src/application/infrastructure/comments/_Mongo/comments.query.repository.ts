import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  DBComment,
} from '../../../schemas/comments/schemas/comments.database.schema';
import { SortOrder } from 'mongoose';

@Injectable()
export class CommentQ {
  constructor(
    @InjectModel(DBComment.name) private commentModel: CommentModelType,
  ) {}
  async getOneComment(id: string): Promise<CommentDocument | null> {
    return this.commentModel.findOne({
      $and: [
        {
          _id: id,
        },
        { isUserBanned: false },
      ],
    });
  }

  async getCommentsForBlog(
    blogOwnerId: string,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {
    const allComments: CommentDocument[] = await this.commentModel
      .find({ 'postInfo.blogOwnerId': blogOwnerId })
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();

    const countDocs = await this.commentModel.countDocuments({
      'postInfo.blogOwnerId': blogOwnerId,
    });
    const pagesCount = Math.ceil(countDocs / pagination['pageSize']);
    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDocs,
      items: allComments,
    };
  }
}
