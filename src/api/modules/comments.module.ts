import { Module } from '@nestjs/common';
import { allReposForComments } from './repositories/all.repos.for.comments';
import { allCommentsUseCases } from './use-cases/all.comments.use-cases';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentSchema,
  DBComment,
} from '../../application/schemas/comments/schemas/comments.database.schema';
import { PublicCommentController } from '../_public/comments.public/comments.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentService } from '../../application/infrastructure/comments/comments.service';
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import { JwtService } from '@nestjs/jwt';
import { PostQ } from '../../application/infrastructure/posts/_Mongo/posts.query.repository';
import { LikesRepository } from '../../application/infrastructure/likes/_Mongo/likes.repository';
import { PostMapper } from '../../application/utils/mappers/post.mapper';
import {
  Post,
  PostSchema,
} from '../../application/schemas/posts/schemas/posts.database.schema';
import {
  Like,
  LikeSchema,
} from '../../application/schemas/likes/schemas/like.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    CqrsModule,
  ],
  controllers: [PublicCommentController],
  providers: [
    ...allReposForComments,
    ...allCommentsUseCases,
    CommentService,
    CommentMapper,
    PostMapper,
    JwtService,
    PostQ,
    LikesRepository,
  ],
})
export class CommentsModule {}
