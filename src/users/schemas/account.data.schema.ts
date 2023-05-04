import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class AccountData {
  @Prop({ require: true })
  login: string;
  @Prop({ require: true })
  email: string;
  @Prop({ require: true })
  password: string;
  @Prop({ require: true })
  passwordSalt: string;
  @Prop({ require: true })
  createdAt: string;
}
