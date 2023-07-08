import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentService } from '../../../../../application/infrastructure/comments/comments.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { CommentsQueryRepository } from '../../../../../application/infrastructure/comments/comments.query.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';

export class DeleteCommentCommand {
  constructor(public commentId: string, public userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private readonly commentQ: CommentsQueryRepository,
    private readonly commentService: CommentService,
  ) {}
  async execute(command: DeleteCommentCommand) {
    errorIfNan(command.commentId);
    const comment: any = await this.commentQ.getOneComment(command.commentId);
    if (comment.length === 0) throw new Errors.NOT_FOUND();
    if (comment[0].commentatorId != command.userId) {
      throw new Errors.FORBIDDEN();
    }
    const result = await this.commentService.deleteOneCommentById(
      command.commentId,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
