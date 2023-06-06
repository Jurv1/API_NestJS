import { ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../comments.repository';

export class UpdateBanStatusForCommentOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}
export class UpdateBanStatusForCommentOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForCommentOwnerCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UpdateBanStatusForCommentOwnerCommand) {
    await this.commentRepository.updateBanStatusForCommentOwner(
      command.userId,
      command.banStatus,
    );
  }
}
