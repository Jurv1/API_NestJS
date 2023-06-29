import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { PostsRepository } from '../../../../../application/infrastructure/posts/posts.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';

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
    private readonly postQ: PostsQueryRepository,
    private readonly postRepository: PostsRepository,
  ) {}
  async execute(
    command: DeleteOnePostBySpecificBlogIdCommand,
  ): Promise<boolean> {
    errorIfNan(command.postId, command.blogId);
    const post: any = await this.postQ.getOnePostByPostAndBlogIds(
      command.postId,
      command.blogId,
    );
    if (post.length === 0) throw new Errors.NOT_FOUND();
    if (post[0].OwnerId !== command.userId) throw new Errors.FORBIDDEN();
    return await this.postRepository.deleteOnePostBySpecificBlogId(
      command.postId,
      command.blogId,
    );
  }
}
