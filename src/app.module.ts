//confModule should be first
import { configModule } from './application/config/config.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blogs/blogs.controller';
import { PostController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { PostService } from './application/infrastructure/posts/posts.service';
import { BlogService } from './application/infrastructure/blogs/blogs.service';
import { UsersService } from './application/infrastructure/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from './application/schemas/blogs/schemas/blogs.database.schema';
import {
  Post,
  PostSchema,
} from './application/schemas/posts/schemas/posts.database.schema';
import {
  User,
  UserSchema,
} from './application/schemas/users/schemas/users.database.schema';
import { BlogsRepository } from './application/infrastructure/blogs/blogs.repository';
import { BlogQ } from './application/infrastructure/blogs/blogs.query.repository';
import { PostsRepository } from './application/infrastructure/posts/posts.repository';
import { PostQ } from './application/infrastructure/posts/posts.query.repository';
import { UsersRepository } from './application/infrastructure/users/users.repository';
import { UserQ } from './application/infrastructure/users/users.query.repository';
import { CommentQ } from './application/infrastructure/comments/comments.query.repository';
import {
  CommentSchema,
  DBComment,
} from './application/schemas/comments/schemas/comments.database.schema';
import { AuthController } from './api/public/auth/auth.controller';
import { AuthModule } from './api/public/auth/auth.module';
import { MailModule } from './application/mail/mail.module';
import { DevicesService } from './application/infrastructure/devices/devices.service';
import { DevicesRepository } from './application/infrastructure/devices/devices.repository';
import {
  Device,
  DeviceSchema,
} from './application/schemas/devices/schemas/devices.database.schema';
import { LikesRepository } from './application/infrastructure/likes/likes.repository';
import {
  Like,
  LikeSchema,
} from './application/schemas/likes/schemas/like.database.schema';
import { JwtService } from '@nestjs/jwt';
import { DeviceQ } from './application/infrastructure/devices/devices.query.repository';
import { DeviceController } from './devices/device.controller';
import { CommentRepository } from './application/infrastructure/comments/comments.repository';
import { CommentService } from './application/infrastructure/comments/comments.service';
import { PostMapper } from './application/utils/mappers/post.mapper';
import { CommentMapper } from './application/utils/mappers/comment.mapper';
import { IsBlogExists } from './application/utils/custom.validation.decorators/is.blog.exists';
import {
  RefreshTokenBlacklist,
  RefreshTokenBlackListSchema,
} from './application/schemas/devices/schemas/refresh-token.blacklist';
import { PublicCommentController } from './api/public/comments.public/comments.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { publicUseCases } from './api/public/public.use-cases';

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
    MongooseModule.forFeature([
      { name: RefreshTokenBlacklist.name, schema: RefreshTokenBlackListSchema },
    ]),
    AuthModule,
    MailModule,
    CqrsModule,
    ...publicUseCases,
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    PublicCommentController,
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
