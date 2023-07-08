import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { PostService } from '../../../../../application/infrastructure/posts/posts.service';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { Post } from '../../../../../application/entities/posts/post.entity';

export class UpdatePostByBlogIdCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdatePostByBlogIdCommand)
export class UpdatePostByBlogIdUseCase
  implements ICommandHandler<UpdatePostByBlogIdCommand>
{
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly postsService: PostService,
  ) {}
  async execute(command: UpdatePostByBlogIdCommand) {
    errorIfNan(command.postId, command.blogId);
    const post: Post[] = await this.postQ.getOnePostByPostAndBlogIds(
      command.postId,
      command.blogId,
    );
    if (post.length === 0) throw new Errors.NOT_FOUND();
    if (post[0].owner.toString() !== command.userId)
      throw new Errors.FORBIDDEN();
    await this.postsService.updateOnePost(
      command.postId,
      command.title,
      command.shortDescription,
      command.content,
      command.blogId,
    );
    return;
  }
}
