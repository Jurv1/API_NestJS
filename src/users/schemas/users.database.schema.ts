import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData } from './account.data.schema';
import { EmailConfirmation } from './email.confirmation.schema';
import { PasswordRecovery } from './password.recovery.schema';
import { UserCreationDto } from '../dto/user.creation.dto';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;
  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;
  @Prop({ required: true })
  passRecovery: PasswordRecovery;

  static createUser(
    userDto: UserCreationDto,
    UserModel: UserModelType,
  ): UserDocument {
    const createdUser = {
      accountData: {
        login: userDto.login,
        email: userDto.email,
        password: userDto.passwordHash,
        passwordSalt: userDto.passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: new Date(),
        isConfirmed: userDto.isConfirmed,
      },
      passRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    };
    return new UserModel(createdUser);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserModelStaticType = {
  createUser: (
    userDto: UserCreationDto,
    UserModel: UserModelType,
  ) => UserDocument;
};

const userStaticMethods: UserModelStaticType = {
  createUser: User.createUser,
};

UserSchema.statics = userStaticMethods;

export type UserModelType = Model<UserDocument> & UserModelStaticType;
