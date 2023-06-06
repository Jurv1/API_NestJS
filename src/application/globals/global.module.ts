import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicBlogController } from '../../api/_public/blogs.public/blogs.public.controller';
import { PublicPostController } from '../../api/_public/posts.public/posts.public.controller';
import { SuperAdminUsersController } from '../../api/_super-admin/super-admin.users/super-admin.users.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    PublicBlogController,
    PublicPostController,
    SuperAdminUsersController,
  ],
  //exports: [BlogsModule, PostsModule, UsersModule],
})
export class GlobalModule {}
