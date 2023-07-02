import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Like,
  LikeSchema,
} from '../../application/schemas/likes/schemas/like.database.schema';
import { LikesRepository } from '../../application/infrastructure/likes/_Mongo/likes.repository';
import { UpdateBanStatusForLikesOwnerUseCase } from '../../application/infrastructure/likes/_Mongo/use-cases/update.ban.status.for.likes.owner.use-case';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [LikesRepository, UpdateBanStatusForLikesOwnerUseCase],
})
export class LikesModule {}
