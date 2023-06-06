import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostQ } from '../../../../application/infrastructure/posts/posts.query.repository';
import { PostDocument } from '../../../../application/schemas/posts/schemas/posts.database.schema';
import { Errors } from '../../../../application/utils/handle.error';
import { PostUpdateBody } from '../../../../application/dto/posts/dto/post.update.body';

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
  constructor(private readonly postQ: PostQ) {}
  async execute(command: UpdatePostByBlogIdCommand) {
    const post: PostDocument = await this.postQ.getOnePostByPostAndBlogIds(
      command.postId,
      command.blogId,
    );
    if (!post) throw new Errors.NOT_FOUND();
    if (post.ownerInfo.userId !== command.userId) throw new Errors.FORBIDDEN();
    const updatePostDto: PostUpdateBody = {
      title: command.title,
      shortDescription: command.shortDescription,
      content: command.content,
    };
    await post.updatePost(updatePostDto);
    await post.save();
    return;
  }
}
