//confModule should be first
import { configModule } from './application/config/config.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostService } from './application/infrastructure/posts/posts.service';
import { BlogService } from './application/infrastructure/blogs/blogs.service';
import { UsersService } from './application/infrastructure/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsRepository } from './application/infrastructure/blogs/blogs.repository';
import { BlogQ } from './application/infrastructure/blogs/blogs.query.repository';
import { PostsRepository } from './application/infrastructure/posts/posts.repository';
import { PostQ } from './application/infrastructure/posts/posts.query.repository';
import { UsersRepository } from './application/infrastructure/users/users.repository';
import { UserQ } from './application/infrastructure/users/users.query.repository';
import { CommentQ } from './application/infrastructure/comments/comments.query.repository';
import { AuthModule } from './api/_public/auth/auth.module';
import { MailModule } from './application/mail/mail.module';
import { DevicesService } from './application/infrastructure/devices/devices.service';
import { DevicesRepository } from './application/infrastructure/devices/devices.repository';
import { LikesRepository } from './application/infrastructure/likes/likes.repository';
import { JwtService } from '@nestjs/jwt';
import { DeviceQ } from './application/infrastructure/devices/devices.query.repository';
import { CommentRepository } from './application/infrastructure/comments/comments.repository';
import { CommentService } from './application/infrastructure/comments/comments.service';
import { PostMapper } from './application/utils/mappers/post.mapper';
import { CommentMapper } from './application/utils/mappers/comment.mapper';
import { IsBlogExists } from './application/utils/custom.validation.decorators/is.blog.exists';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './api/modules/users.module';
import { DevicesModule } from './api/modules/devices.module';
import { BlogsModule } from './api/modules/blogs.module';
import { CommentsModule } from './api/modules/comments.module';
import { LikesModule } from './api/modules/likes.module';
import {
  CommentSchema,
  DBComment,
} from './application/schemas/comments/schemas/comments.database.schema';
import {
  Post,
  PostSchema,
} from './application/schemas/posts/schemas/posts.database.schema';
import {
  Blog,
  BlogSchema,
} from './application/schemas/blogs/schemas/blogs.database.schema';
import {
  User,
  UserSchema,
} from './application/schemas/users/schemas/users.database.schema';
import {
  Device,
  DeviceSchema,
} from './application/schemas/devices/schemas/devices.database.schema';
import {
  Like,
  LikeSchema,
} from './application/schemas/likes/schemas/like.database.schema';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: DBComment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    AuthModule,
    MailModule,
    CqrsModule,
    UsersModule,
    DevicesModule,
    BlogsModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
