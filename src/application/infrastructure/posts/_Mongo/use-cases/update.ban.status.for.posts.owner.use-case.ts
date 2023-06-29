import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts.repository';

export class UpdateBanStatusForPostsOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}

@CommandHandler(UpdateBanStatusForPostsOwnerCommand)
export class UpdateBanStatusForPostsOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForPostsOwnerCommand>
{
  constructor(private readonly postRepository: PostsRepository) {}

  async execute(command: UpdateBanStatusForPostsOwnerCommand) {
    await this.postRepository.updateBanStatusForPostByOwnerId(
      command.banStatus,
    );
    return true;
  }
}
