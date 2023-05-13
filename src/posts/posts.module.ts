import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/posts.database.schema';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { PostQ } from './posts.query.repository';
import { PostsRepository } from './posts.repository';
import { BlogQ } from '../blogs/blogs.query.repository';
import { CommentQ } from '../comments/comments.query.repository';
import {
  CommentSchema,
  DBComment,
} from '../comments/schemas/comments.database.schema';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostQ, PostsRepository, BlogQ, CommentQ],
  exports: [PostService, PostQ, PostsRepository],
})
export class PostsModule {}
