import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBComment } from '../../../schemas/comments/schemas/comments.database.schema';
import { Model } from 'mongoose';

@Injectable()
export class _MongoCommentRepository {
  constructor(
    @InjectModel(DBComment.name)
    private readonly commentModel: Model<DBComment>,
  ) {}

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async updateBanStatusForCommentOwner(userId: string, banStatus: boolean) {
    return this.commentModel.updateMany(
      { 'commentatorInfo.userId': userId },
      { $set: { isUserBanned: banStatus } },
    );
  }
}
