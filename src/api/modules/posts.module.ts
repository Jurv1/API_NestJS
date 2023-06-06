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

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [
    ...allPostsUseCases,
    ...allReposForPosts,
    LikesRepository,
    PostMapper,
    CommentMapper,
  ],
})
export class PostsModule {}
