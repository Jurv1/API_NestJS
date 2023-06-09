import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData } from './account.data.schema';
import { EmailConfirmation } from './email.confirmation.schema';
import { PasswordRecovery } from './password.recovery.schema';
import { UserCreationDto } from '../../../dto/users/dto/user.creation.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordRecoveryDto } from '../../../dto/users/dto/password-recovery.dto';
import { UpdatePasswordDto } from '../../../dto/users/dto/update.password.dto';
import { BanInfo } from './ban.info.schema';
import { BanBody } from '../../../dto/users/dto/ban.body';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;
  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;
  @Prop({ required: true })
  passRecovery: PasswordRecovery;
  @Prop()
  banInfo: BanInfo;
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
        expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
        isConfirmed: userDto.isConfirmed,
      },
      passRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
    return new UserModel(createdUser);
  }

  updateRecoveryCode(recoveryCodeDto: PasswordRecoveryDto) {
    this.passRecovery.recoveryCode = recoveryCodeDto.recoveryCode;
    this.passRecovery.expirationDate = recoveryCodeDto.expirationDate;
  }

  updatePassword(passwordUpdateDto: UpdatePasswordDto) {
    this.accountData.password = passwordUpdateDto.passwordHash;
    this.accountData.passwordSalt = passwordUpdateDto.passwordSalt;
  }

  updateEmailConfirmation(confirmation: boolean) {
    this.emailConfirmation.isConfirmed = confirmation;
  }

  updateEmailConfirmationCode(code: string) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
  }

  updateBanInfo(banInfo: BanBody) {
    this.banInfo.isBanned = banInfo.isBanned;
    this.banInfo.banReason = banInfo.banReason;
    this.banInfo.banDate = new Date().toISOString();
    if (!banInfo.isBanned) {
      this.banInfo.banReason = null;
      this.banInfo.banDate = null;
    }
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

UserSchema.methods = {
  updateRecoveryCode: User.prototype.updateRecoveryCode,
  updatePassword: User.prototype.updatePassword,
  updateEmailConfirmation: User.prototype.updateEmailConfirmation,
  updateEmailConfirmationCode: User.prototype.updateEmailConfirmationCode,
  updateBanInfo: User.prototype.updateBanInfo,
};

export type UserModelType = Model<UserDocument> & UserModelStaticType;
