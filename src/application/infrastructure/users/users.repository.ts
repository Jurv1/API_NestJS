import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../schemas/users/schemas/users.database.schema';
import { UserCreationDto } from '../../dto/users/dto/user.creation.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModelType,
  ) {}
  async createOne(
    userCreationDto: UserCreationDto,
  ): Promise<UserDocument | null> {
    const createdUser: UserDocument = this.userModel.createUser(
      userCreationDto,
      this.userModel,
    );
    await createdUser.save();
    return createdUser;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
