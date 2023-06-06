import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../../application/infrastructure/posts/posts.repository';
import { PostQ } from '../../../../application/infrastructure/posts/posts.query.repository';
import { PostDocument } from '../../../../application/schemas/posts/schemas/posts.database.schema';
import { Errors } from '../../../../application/utils/handle.error';

export class DeleteOnePostBySpecificBlogIdCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOnePostBySpecificBlogIdCommand)
export class DeleteOnePostBySpecificBlogIdUseCase
  implements ICommandHandler<DeleteOnePostBySpecificBlogIdCommand>
{
  constructor(
    private readonly postQ: PostQ,
    private readonly postRepository: PostsRepository,
  ) {}
  async execute(
    command: DeleteOnePostBySpecificBlogIdCommand,
  ): Promise<boolean> {
    const post: PostDocument = await this.postQ.getOnePostByPostAndBlogIds(
      command.postId,
      command.blogId,
    );
    if (!post) throw new Errors.NOT_FOUND();
    if (post.ownerInfo.userId !== command.userId) throw new Errors.FORBIDDEN();
    return await this.postRepository.deleteOnePostBySpecificBlogId(
      command.postId,
      command.blogId,
    );
  }
}
