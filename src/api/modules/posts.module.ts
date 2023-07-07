import { Module } from '@nestjs/common';
import { allPostsUseCases } from './use-cases/all.posts.use-cases';
import { allReposForPosts } from './repositories/all.repos.for.posts';
import { CqrsModule } from '@nestjs/cqrs';
import { PostMapper } from '../../application/utils/mappers/post.mapper';
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import { PublicPostController } from '../_public/posts.public/posts.public.controller';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentForPostUseCase } from '../_public/posts.public/use-cases/command.use-cases/create.comment.for.post.use-case';
import { PostService } from '../../application/infrastructure/posts/posts.service';
import { BlogsQueryRepository } from '../../application/infrastructure/blogs/blogs.query.repository';
import { PostsLikesRepository } from '../../application/infrastructure/likes/posts.likes.repository';
import { CommentsRepository } from '../../application/infrastructure/comments/comments.repository';
import { CommentsLikesRepository } from '../../application/infrastructure/likes/comments.likes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../application/entities/posts/post.entity';
import { PostsLike } from '../../application/entities/posts/posts.like.entity';
import { Blog } from '../../application/entities/blogs/blog.entity';
import { CommentsLike } from '../../application/entities/comments/comments.like.entity';
import { Comment } from '../../application/entities/comments/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostsLike, Blog, CommentsLike, Comment]),
    CqrsModule,
  ],
  controllers: [PublicPostController],
  providers: [
    ...allPostsUseCases,
    ...allReposForPosts,
    CreateCommentForPostUseCase,
    PostService,
    BlogsQueryRepository,
    PostsLikesRepository,
    CommentsRepository,
    CommentsLikesRepository,
    PostMapper,
    CommentMapper,
    JwtService,
  ],
})
export class PostsModule {}
