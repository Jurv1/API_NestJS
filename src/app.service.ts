import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogModelType,
} from './application/schemas/blogs/schemas/blogs.database.schema';
import {
  Post,
  PostModelType,
} from './application/schemas/posts/schemas/posts.database.schema';
import {
  CommentModelType,
  DBComment,
} from './application/schemas/comments/schemas/comments.database.schema';
import {
  User,
  UserModelType,
} from './application/schemas/users/schemas/users.database.schema';
import {
  Device,
  DeviceModelType,
} from './application/schemas/devices/schemas/devices.database.schema';
import {
  Like,
  LikeModelType,
} from './application/schemas/likes/schemas/like.database.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    @InjectModel(Post.name) private postModel: PostModelType,
    @InjectModel(DBComment.name) private commentModel: CommentModelType,
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(Device.name) private readonly deviceModel: DeviceModelType,
    @InjectModel(Like.name) private readonly likeModel: LikeModelType,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async deleteAll() {
    await this.blogModel.deleteMany();
    await this.postModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.userModel.deleteMany();
    await this.deviceModel.deleteMany();
    await this.likeModel.deleteMany();
  }
}
