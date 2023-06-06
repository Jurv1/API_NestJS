import { Module } from '@nestjs/common';
import { SuperAdminUsersController } from '../_super-admin/super-admin.users/super-admin.users.controller';
import { allUsersUseCases } from './use-cases/all.users.use-cases';
import { allReposForUserModule } from './repositories/all.repos.for.user.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CommentSchema,
  DBComment,
} from '../../application/schemas/comments/schemas/comments.database.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Post,
  PostSchema,
} from '../../application/schemas/posts/schemas/posts.database.schema';
import {
  Blog,
  BlogSchema,
} from '../../application/schemas/blogs/schemas/blogs.database.schema';
import {
  User,
  UserSchema,
} from '../../application/schemas/users/schemas/users.database.schema';
import {
  Like,
  LikeSchema,
} from '../../application/schemas/likes/schemas/like.database.schema';
import {
  Device,
  DeviceSchema,
} from '../../application/schemas/devices/schemas/devices.database.schema';
import { UserMapper } from '../../application/utils/mappers/user.mapper';
import { UsersService } from '../../application/infrastructure/users/users.service';
import { MailService } from '../../application/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    CqrsModule,
  ],
  controllers: [SuperAdminUsersController],
  providers: [
    ...allUsersUseCases,
    ...allReposForUserModule,
    UserMapper,
    UsersService,
    MailService,
  ],
})
export class UsersModule {}
