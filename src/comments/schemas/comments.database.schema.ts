import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentatorInfo } from './commentator.info.schema';
import { ExtendedLike } from '../../posts/schemas/likes.schemas/extended.likes.schema';
import { HydratedDocument } from 'mongoose';

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
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(DBComment);
