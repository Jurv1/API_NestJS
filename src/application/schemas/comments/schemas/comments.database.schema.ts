import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentatorInfo } from './commentator.info.schema';
import { ExtendedLike } from '../../posts/schemas/likes.schemas/extended.likes.schema';
import { HydratedDocument, Model } from 'mongoose';
import { CommentCreatingDto } from '../../../dto/comments/dto/comment.creating.dto';

export type CommentDocument = HydratedDocument<DBComment>;
@Schema()
export class DBComment {
  @Prop()
  content: string;
  @Prop()
  commentatorInfo: CommentatorInfo;
  @Prop()
  likesInfo: ExtendedLike;
  @Prop()
  postId: string;
  @Prop()
  isUserBanned: boolean;
  @Prop()
  createdAt: string;

  static createComment(
    commentDto: CommentCreatingDto,
    CommentModel: CommentModelType,
  ) {
    const createdComment = {
      content: commentDto.content,
      commentatorInfo: commentDto.commentatorInfo,
      likesInfo: commentDto.likesInfo,
      postId: commentDto.postId,
      isUserBanned: false,
      createdAt: new Date().toISOString(),
    };
    return new CommentModel(createdComment);
  }

  updateComment(content: string) {
    this.content = content;
  }

  updateBanUser(banStatus: boolean) {
    this.isUserBanned = banStatus;
  }
}

export const CommentSchema = SchemaFactory.createForClass(DBComment);

export type CommentModelStaticType = {
  createComment: (
    commentDto: CommentCreatingDto,
    CommentModel: CommentModelType,
  ) => CommentDocument;
};
const commentStaticMethods: CommentModelStaticType = {
  createComment: DBComment.createComment,
};

CommentSchema.statics = commentStaticMethods;

CommentSchema.methods = {
  updateComment: DBComment.prototype.updateComment,
};
export type CommentModelType = Model<CommentDocument> & CommentModelStaticType;
