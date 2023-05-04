import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccountData } from './account.data.schema';
import { EmailConfirmation } from './email.confirmation.schema';
import { PasswordRecovery } from './password.recovery.schema';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;
  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;
  @Prop({ required: true })
  passRecovery: PasswordRecovery;
}

export const UserSchema = SchemaFactory.createForClass(User);
