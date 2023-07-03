import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsLikesRepository } from '../../posts.likes.repository';
import { CommentsLikesRepository } from '../../comments.likes.repository';

export class UpdateBanStatusForLikesOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}

@CommandHandler(UpdateBanStatusForLikesOwnerCommand)
export class UpdateBanStatusForLikesOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForLikesOwnerCommand>
{
  constructor(
    private readonly postsLikeRepository: PostsLikesRepository,
    private readonly commentsLikesRepository: CommentsLikesRepository,
  ) {}

  async execute(command: UpdateBanStatusForLikesOwnerCommand) {
    await this.postsLikeRepository.findAllLikesByUserIdAndSetBanStatus(
      command.userId,
      command.banStatus,
    );

    await this.commentsLikesRepository.findAllLikesByUserIdAndSetBanStatus(
      command.userId,
      command.banStatus,
    );

    return true;
  }
}
