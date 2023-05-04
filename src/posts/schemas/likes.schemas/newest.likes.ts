import { Prop, Schema } from '@nestjs/mongoose';
@Schema()
export class NewestLike {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}
