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
  Like,
  LikeModelType,
} from './application/schemas/likes/schemas/like.database.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    @InjectModel(Post.name) private postModel: PostModelType,
    @InjectModel(DBComment.name) private commentModel: CommentModelType,
    @InjectModel(Like.name) private readonly likeModel: LikeModelType,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async deleteAll() {
    await this.blogModel.deleteMany();
    await this.postModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.dataSource.query(
      `
      DELETE FROM public."Devices";
      DELETE FROM public."BansForUsersByAdmin";
      DELETE FROM public."EmailConfirmationForUsers";
      DELETE FROM public."PasswordRecoveryForUsers";
      DELETE FROM public."Users";
      `,
    );
    await this.likeModel.deleteMany();
  }
}
