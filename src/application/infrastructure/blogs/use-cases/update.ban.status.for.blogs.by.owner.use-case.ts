import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../blogs.repository';

export class UpdateBanStatusForBlogsByOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}
//todo
@CommandHandler(UpdateBanStatusForBlogsByOwnerCommand)
export class UpdateBanStatusForBlogsByOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForBlogsByOwnerCommand>
{
  constructor(private readonly blogRepository: BlogsRepository) {}
  async execute(command: UpdateBanStatusForBlogsByOwnerCommand) {
    await this.blogRepository.updateBanStatusForBlogsByOwnerId(command.userId);

    await this.blogRepository.updateIsBannedForBlog(
      command.userId,
      command.banStatus,
    );
    return true;
  }
}
