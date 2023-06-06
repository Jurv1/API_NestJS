import { Prop, Schema } from '@nestjs/mongoose';
import { NewestLike } from './newest.likes';
@Schema()
export class ExtendedLike {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
  @Prop({ required: true })
  myStatus: string;
}
