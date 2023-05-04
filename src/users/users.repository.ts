import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.database.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createOne(newUserTmp: any): Promise<any | null> {
    const resultId = await this.userModel.create(newUserTmp);
    console.log(resultId);
    return this.userModel.findOne({ _id: resultId._id });
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
