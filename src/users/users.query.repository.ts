import { Injectable } from '@nestjs/common';
import { SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from './schemas/users.database.schema';

//todo change model
@Injectable()
export class UserQ {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}
  async getAllUsers(
    filter: any,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<any> {
    const allUsers = await this.userModel
      .find(filter)
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();

    const countDocs = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(countDocs / pagination['pageSize']);

    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDocs,
      items: allUsers,
    };
  }

  async getOneUserByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ 'accountData.login': login });
  }

  async getOneByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    });
  }

  async getOneUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async getOneByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
    });
  }

  async getOneByPassCode(code: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ 'passRecovery.recoveryCode': code });
  }
}
