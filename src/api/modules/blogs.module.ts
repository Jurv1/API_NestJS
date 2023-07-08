import { Module } from '@nestjs/common';
import { allBlogsUseCases } from './use-cases/all.blogs.use-cases';
import { allReposForBlogs } from './repositories/all.repos.for.blogs';
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
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import { PublicBlogController } from '../_public/blogs.public/blogs.public.controller';
import { PostsLikesRepository } from '../../application/infrastructure/likes/posts.likes.repository';
import { CommentsLikesRepository } from '../../application/infrastructure/likes/comments.likes.repository';
import { CommentsQueryRepository } from '../../application/infrastructure/comments/comments.query.repository';
import { CommentsRepository } from '../../application/infrastructure/comments/comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../application/entities/posts/post.entity';
import { Blog } from '../../application/entities/blogs/blog.entity';
import { Comment } from '../../application/entities/comments/comment.entity';
import { CommentsLike } from '../../application/entities/comments/comments.like.entity';
import { PostsLike } from '../../application/entities/posts/posts.like.entity';
import { BlogBansByAdmin } from '../../application/entities/blogs/blog.bans.by.admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      BlogBansByAdmin,
      Post,
      Comment,
      CommentsLike,
      PostsLike,
    ]),
    CqrsModule,
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
    PostsLikesRepository,
    CommentsLikesRepository,
    CommentsQueryRepository,
    CommentsRepository,
  ],
})
export class BlogsModule {}
