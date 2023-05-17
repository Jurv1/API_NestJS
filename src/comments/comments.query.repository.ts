import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, DBComment } from './schemas/comments.database.schema';
import { LikesRepository } from '../likes/likes.repository';

@Injectable()
export class CommentQ {
  constructor(
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
    private readonly likesRepo: LikesRepository,
  ) {}
  async getOneComment(id: string, userId?: string): Promise<any | null> {
    const allLikes: number = await this.likesRepo.countAllLikesForPostOrComment(
      id,
    );
    const allDislikes: number =
      await this.likesRepo.countAllDislikesForPostOrComment(id);
    let userStatus;

    const result: CommentDocument = await this.commentModel.findById({
      _id: id,
    });

    if (userId) {
      const like = await this.likesRepo.getUserStatusForComment(
        userId.toString(),
        id.toString(),
      );
      userStatus = like?.userStatus;
    }

    return {
      id: result?._id.toString(),
      content: result?.content,
      commentatorInfo: {
        userId: result?.commentatorInfo.userId,
        userLogin: result?.commentatorInfo.userLogin,
      },
      createdAt: result?.createdAt,
      likesInfo: {
        likesCount: allLikes,
        dislikesCount: allDislikes,
        myStatus: userStatus || 'None',
      },
    };
  }
}
