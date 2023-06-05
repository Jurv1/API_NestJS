import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentQ } from '../../../../comments/comments.query.repository';
import { Errors } from '../../../../utils/handle.error';
export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public content: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentQ: CommentQ) {}
  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentQ.getOneComment(command.commentId);
    if (!comment) {
      throw new Errors.NOT_FOUND();
    }

    if (comment.commentatorInfo.userId !== command.userId) {
      throw new Errors.FORBIDDEN();
    }
    await comment.updateComment(command.content);
    await comment.save();
    return true;
  }
}
