import { ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../blogs.repository';

export class UpdateBanStatusForBlogsByOwnerCommand {
  constructor(public userId: string, public banStatus: boolean) {}
}
export class UpdateBanStatusForBlogsByOwnerUseCase
  implements ICommandHandler<UpdateBanStatusForBlogsByOwnerCommand>
{
  constructor(private readonly blogRepository: BlogsRepository) {}
  async execute(command: UpdateBanStatusForBlogsByOwnerCommand) {
    return await this.blogRepository.updateBanStatusForBlogsByOwnerId(
      command.userId,
      command.banStatus,
    );
  }
}
