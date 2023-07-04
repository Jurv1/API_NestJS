import { Module } from '@nestjs/common';
import { allReposForComments } from './repositories/all.repos.for.comments';
import { allCommentsUseCases } from './use-cases/all.comments.use-cases';
import { PublicCommentController } from '../_public/comments.public/comments.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentService } from '../../application/infrastructure/comments/comments.service';
import { CommentMapper } from '../../application/utils/mappers/comment.mapper';
import { JwtService } from '@nestjs/jwt';
import { PostMapper } from '../../application/utils/mappers/post.mapper';
import { PostsQueryRepository } from '../../application/infrastructure/posts/posts.query.repository';
import { PostsLikesRepository } from '../../application/infrastructure/likes/posts.likes.repository';

@Module({
  imports: [CqrsModule],
  controllers: [PublicCommentController],
  providers: [
    ...allReposForComments,
    ...allCommentsUseCases,
    CommentService,
    PostsLikesRepository,
    PostsQueryRepository,
    CommentMapper,
    PostMapper,
    JwtService,
  ],
})
export class CommentsModule {}
