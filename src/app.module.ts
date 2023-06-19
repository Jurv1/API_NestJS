//confModule should be first
import { configModule } from './application/config/config.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/_public/auth/auth.module';
import { MailModule } from './mail/mail.module';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: false,
      synchronize: false,
    }),
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
