import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blogs.database.schema';
import { BlogController } from './blogs.controller';
import { BlogService } from './blogs.service';
import { BlogQ } from './blogs.query.repository';
import { BlogsRepository } from './blogs.repository';
import { PostService } from '../posts/posts.service';
import { PostQ } from '../posts/posts.query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature(),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogQ, BlogsRepository, PostService, PostQ],
  exports: [BlogService, BlogQ, BlogsRepository, PostService, PostQ],
})
export class BlogsModule {}
