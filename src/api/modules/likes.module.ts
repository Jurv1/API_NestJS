import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBanStatusForLikesOwnerUseCase } from '../../application/infrastructure/likes/_Mongo/use-cases/update.ban.status.for.likes.owner.use-case';
import { PostsLikesRepository } from '../../application/infrastructure/likes/posts.likes.repository';
import { CommentsLikesRepository } from '../../application/infrastructure/likes/comments.likes.repository';

@Module({
  imports: [CqrsModule],
  providers: [
    PostsLikesRepository,
    CommentsLikesRepository,
    UpdateBanStatusForLikesOwnerUseCase,
  ],
})
export class LikesModule {}
