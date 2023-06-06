import { Module } from '@nestjs/common';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    BlogsModule,
    PostsModule,
    UsersModule,
  ],
  exports: [BlogsModule, PostsModule, UsersModule],
})
export class GlobalModule {}
