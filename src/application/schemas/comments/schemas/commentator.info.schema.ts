import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
}
