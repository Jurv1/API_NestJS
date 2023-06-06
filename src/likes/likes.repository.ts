import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikeDocument,
  LikeModelType,
} from './schemas/like.database.schema';
import { LikeCreationDto } from './dto/like-creation.dto';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: LikeModelType,
  ) {}

  async deleteLikeDislike(
    userId: string,
    commentId: string,
    userStatus: string,
  ) {
    const result = await this.likeModel.deleteOne({
      $and: [
        { userId: userId },
        { commentPostId: commentId },
        { userStatus: userStatus },
      ],
    });

    return result.deletedCount === 1;
  }

  async getUserStatusForCommentOrPost(
    userId: string,
    commentId: string,
  ): Promise<LikeDocument | null> {
    return this.likeModel.findOne({
      $and: [{ userId: userId }, { commentPostId: commentId }],
    });
  }

  async likePostOrComment(
    commentPostId: string,
    likeStatus: string,
    userId: string,
    userLogin: string,
  ): Promise<LikeDocument | null> {
    const likeCreationDto: LikeCreationDto = {
      userId: userId,
      userLogin: userLogin,
      userStatus: likeStatus,
      commentPostId: commentPostId,
    };
    const like: LikeDocument = this.likeModel.createLike(
      likeCreationDto,
      this.likeModel,
    );
    await like.save();
    return like;
  }

  async countAllLikesForPostOrComment(id: string) {
    const allLikes: number = await this.likeModel.countDocuments({
      $and: [{ commentPostId: id }, { userStatus: 'Like' }],
    });

    return allLikes;
  }

  async countAllDislikesForPostOrComment(id: string) {
    const allDislikes: number = await this.likeModel.countDocuments({
      $and: [{ commentPostId: id }, { userStatus: 'Dislike' }],
    });

    return allDislikes;
  }

  async findLatestThreeLikes(commentId: string) {
    return this.likeModel
      .find({ $and: [{ commentPostId: commentId }, { userStatus: 'Like' }] })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }

  async findAllLikesByUserIdAndSetBanStatus(
    userId: string,
    banStatus: boolean,
  ) {
    return this.likeModel.updateMany(
      { userId: userId },
      { $set: { isUserBanned: banStatus } },
    );
  }
}
