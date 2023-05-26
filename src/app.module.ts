import { ConfigModule } from '@nestjs/config';
export const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blogs/blogs.controller';
import { PostController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { PostService } from './posts/posts.service';
import { BlogService } from './blogs/blogs.service';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/schemas/blogs.database.schema';
import { Post, PostSchema } from './posts/schemas/posts.database.schema';
import { User, UserSchema } from './users/schemas/users.database.schema';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogQ } from './blogs/blogs.query.repository';
import { PostsRepository } from './posts/posts.repository';
import { PostQ } from './posts/posts.query.repository';
import { UsersRepository } from './users/users.repository';
import { UserQ } from './users/users.query.repository';
import { CommentQ } from './comments/comments.query.repository';
import {
  CommentSchema,
  DBComment,
} from './comments/schemas/comments.database.schema';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { DevicesService } from './devices/devices.service';
import { DevicesRepository } from './devices/devices.repository';
import {
  Device,
  DeviceSchema,
} from './devices/schemas/devices.database.schema';
import { LikesRepository } from './likes/likes.repository';
import { Like, LikeSchema } from './likes/schemas/like.database.schema';
import { JwtService } from '@nestjs/jwt';
import { DeviceQ } from './devices/devices.query.repository';
import { DeviceController } from './devices/device.controller';
import { CommentController } from './comments/comments.controller';
import { CommentRepository } from './comments/comments.repository';
import { CommentService } from './comments/comments.service';
import { PostMapper } from './utils/mappers/post.mapper';
import { CommentMapper } from './utils/mappers/comment.mapper';
import { IsBlogExists } from './utils/custom.validation.decorators/is.blog.exists';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    AuthModule,
    MailModule,
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    UsersController,
    AuthController,
    DeviceController,
  ],
  providers: [
    AppService,
    BlogService,
    PostService,
    UsersService,
    BlogsRepository,
    BlogQ,
    PostsRepository,
    PostQ,
    UsersRepository,
    UserQ,
    CommentQ,
    PostMapper,
    CommentMapper,
    DevicesService,
    DevicesRepository,
    LikesRepository,
    JwtService,
    DeviceQ,
    CommentRepository,
    CommentService,
    IsBlogExists,
  ],
})
export class AppModule {}
