import { Module } from '@nestjs/common';
import { allPostsUseCases } from './use-cases/all.posts.use-cases';
import { allReposForPosts } from './repositories/all.repos.for.posts';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Post,
  PostSchema,
} from '../../application/schemas/posts/schemas/posts.database.schema';
import {
  CommentSchema,
  DBComment,
} from '../../application/schemas/comments/schemas/comments.database.schema';
import { LikesRepository } from '../../application/infrastructure/likes/likes.repository';
import { PostMapper } from '../../application/utils/mappers/post.mapper';
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import {
  Like,
  LikeSchema,
} from '../../application/schemas/likes/schemas/like.database.schema';
import { PublicPostController } from '../_public/posts.public/posts.public.controller';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentForPostUseCase } from '../_public/posts.public/use-cases/create.comment.for.post.use-case';
import { PostService } from '../../application/infrastructure/posts/posts.service';
import {
  Blog,
  BlogSchema,
} from '../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogsQueryRepository } from '../../application/infrastructure/blogs/blogs.query.repository';
import { PostQ } from '../../application/infrastructure/posts/_Mongo/posts.query.repository';
import { BlogQ } from '../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [PublicPostController],
  providers: [
    ...allPostsUseCases,
    ...allReposForPosts,
    CreateCommentForPostUseCase,
    PostService,
    PostQ,
    BlogQ,
    BlogsQueryRepository,
    LikesRepository,
    PostMapper,
    CommentMapper,
    JwtService,
  ],
})
export class PostsModule {}
