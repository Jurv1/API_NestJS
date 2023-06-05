import { ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../posts/posts.service';
import { CommentMapper } from '../../../../utils/mappers/comment.mapper';
import { CommentDocument } from '../../../../comments/schemas/comments.database.schema';
import { Errors } from '../../../../utils/handle.error';

export class CreateCommentForPostCommand {
  constructor(
    public postId: string,
    public content: string,
    public userId: string,
    public userLogin: string,
  ) {}
}

export class CreateCommentForPostUseCase
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(
    private readonly postService: PostService,
    private readonly commentMapper: CommentMapper,
  ) {}
  async execute(command: CreateCommentForPostCommand) {
    const result: CommentDocument =
      await this.postService.createOneCommentByPostId(
        command.postId,
        command.content,
        command.userId,
        command.userLogin,
      );
    if (!result) throw new Errors.NOT_FOUND();
    return await this.commentMapper.mapComment(result);
  }
}
