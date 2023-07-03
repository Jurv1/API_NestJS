import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments.repository';

export class UpdateBanStatusForCommentOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}

@CommandHandler(UpdateBanStatusForCommentOwnerCommand)
export class UpdateBanStatusForCommentOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForCommentOwnerCommand>
{
  constructor(private readonly commentRepository: CommentsRepository) {}

  async execute(command: UpdateBanStatusForCommentOwnerCommand) {
    return await this.commentRepository.updateBanStatusForCommentOwner(
      command.userId,
      command.banStatus,
    );
  }
}
