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
    //await this.blogRepository.updateBanStatusForBlogsByOwnerId(command.userId);
    let date;
    command.banStatus ? (date = new Date().toISOString()) : (date = null);
    await this.blogRepository.updateIsBannedForBlogs(
      command.userId,
      date,
      command.banStatus,
    );
    await this.blogRepository;
    return true;
  }
}
