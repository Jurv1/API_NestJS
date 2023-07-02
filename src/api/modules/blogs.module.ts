import { Module } from '@nestjs/common';
import { allBlogsUseCases } from './use-cases/all.blogs.use-cases';
import { allReposForBlogs } from './repositories/all.repos.for.blogs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../../application/schemas/blogs/schemas/blogs.database.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { SuperAdminBlogsController } from '../_super-admin/super-admin.blogs/super-admin.blogs.controller';
import { BloggerBlogController } from '../_blogger/blogs.blogger/blogs.blogger.controller';
import { PostsModule } from './posts.module';
import { BlogMapper } from '../../application/utils/mappers/blog.mapper';
import { JwtService } from '@nestjs/jwt';
import { IsBlogExists } from '../../application/utils/custom.validation.decorators/is.blog.exists';
import { BlogService } from '../../application/infrastructure/blogs/blogs.service';
import { PostService } from '../../application/infrastructure/posts/posts.service';
import { PostMapper } from '../../application/utils/mappers/post.mapper';
import { allReposForPosts } from './repositories/all.repos.for.posts';
import { allPostsUseCases } from './use-cases/all.posts.use-cases';
import {
  Post,
  PostSchema,
} from '../../application/schemas/posts/schemas/posts.database.schema';
import {
  CommentSchema,
  DBComment,
} from '../../application/schemas/comments/schemas/comments.database.schema';
import { LikesRepository } from '../../application/infrastructure/likes/_Mongo/likes.repository';
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import {
  Like,
  LikeSchema,
} from '../../application/schemas/likes/schemas/like.database.schema';
import { PublicBlogController } from '../_public/blogs.public/blogs.public.controller';
import { CommentQ } from '../../application/infrastructure/comments/comments.query.repository';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: DBComment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    PostsModule,
  ],
  controllers: [
    SuperAdminBlogsController,
    BloggerBlogController,
    PublicBlogController,
  ],
  providers: [
    ...allBlogsUseCases,
    ...allReposForBlogs,
    ...allReposForPosts,
    ...allPostsUseCases,
    JwtService,
    BlogMapper,
    CommentMapper,
    IsBlogExists,
    BlogService,
    PostService,
    PostMapper,
    LikesRepository,
    CommentQ,
  ],
})
export class BlogsModule {}
