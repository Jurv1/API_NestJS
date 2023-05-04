import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './blogs/schemas/blogs.database.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts/schemas/posts.database.schema';
import {
  CommentDocument,
  DBComment,
} from './comments/schemas/comments.database.schema';
import { User, UserDocument } from './users/schemas/users.database.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async deleteAll() {
    await this.blogModel.deleteMany();
    await this.postModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.userModel.deleteMany();
  }
}
