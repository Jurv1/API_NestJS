import { Injectable } from '@nestjs/common';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.database.schema';

@Injectable()
export class UserQ {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
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
      items: allUsers.map((el) => {
        return {
          id: el._id.toString(),
          login: el.accountData.login,
          email: el.accountData.email,
          createdAt: el.accountData.createdAt,
        };
      }),
    };
  }
}
