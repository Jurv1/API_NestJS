import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBanStatusForLikesOwnerUseCase } from '../../application/infrastructure/likes/_Mongo/use-cases/update.ban.status.for.likes.owner.use-case';
import { PostsLikesRepository } from '../../application/infrastructure/likes/posts.likes.repository';
import { CommentsLikesRepository } from '../../application/infrastructure/likes/comments.likes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../application/entities/posts/post.entity';
import { Comment } from '../../application/entities/comments/comment.entity';
import { CommentsLike } from '../../application/entities/comments/comments.like.entity';
import { PostsLike } from '../../application/entities/posts/posts.like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, CommentsLike, PostsLike]),
    CqrsModule,
  ],
  providers: [
    PostsLikesRepository,
    CommentsLikesRepository,
    UpdateBanStatusForLikesOwnerUseCase,
  ],
})
export class LikesModule {}
