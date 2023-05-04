import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExtendedLike } from './likes.schemas/extended.likes.schema';
import { HydratedDocument } from 'mongoose';

//todo mapping for extended likes info
export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
  @Prop()
  extendedLikesInfo: ExtendedLike;
  @Prop()
  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
