import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeCreationDto } from '../../../dto/likes/dto/like-creation.dto';

export type LikeDocument = HydratedDocument<Like>;
@Schema()
export class Like {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  userStatus: string;
  @Prop()
  commentPostId: string;
  @Prop()
  isUserBanned: boolean;
  @Prop()
  addedAt: string;

  updateBanInfo(banStatus: boolean) {
    this.isUserBanned = banStatus;
  }
  static createLike(likeDto: LikeCreationDto, LikeModel: LikeModelType) {
    const createdLike = {
      userId: likeDto.userId,
      userLogin: likeDto.userLogin,
      userStatus: likeDto.userStatus,
      commentPostId: likeDto.commentPostId,
      isUserBanned: false,
      addedAt: new Date().toISOString(),
    };

    return new LikeModel(createdLike);
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export type LikeModelStaticType = {
  createLike: (likeDto, LikeModel) => LikeDocument;
};

const likeStaticMethods: LikeModelStaticType = {
  createLike: Like.createLike,
};

LikeSchema.statics = likeStaticMethods;

LikeSchema.methods = {
  updateBanStatus: Like.prototype.updateBanInfo,
};

export type LikeModelType = Model<Like> & LikeModelStaticType;
