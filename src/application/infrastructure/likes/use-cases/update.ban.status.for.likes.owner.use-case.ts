import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../likes.repository';

export class UpdateBanStatusForLikesOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}

@CommandHandler(UpdateBanStatusForLikesOwnerCommand)
export class UpdateBanStatusForLikesOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForLikesOwnerCommand>
{
  constructor(private readonly likeRepository: LikesRepository) {}

  async execute(command: UpdateBanStatusForLikesOwnerCommand) {
    return await this.likeRepository.findAllLikesByUserIdAndSetBanStatus(
      command.userId,
      command.banStatus,
    );
  }
}
