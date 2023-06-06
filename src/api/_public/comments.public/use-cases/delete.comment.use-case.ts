import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentQ } from '../../../../application/infrastructure/comments/comments.query.repository';
import { CommentService } from '../../../../application/infrastructure/comments/comments.service';
import { CommentDocument } from '../../../../application/schemas/comments/schemas/comments.database.schema';
import { Errors } from '../../../../application/utils/handle.error';

export class DeleteCommentCommand {
  constructor(public commentId: string, public userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private readonly commentQ: CommentQ,
    private readonly commentService: CommentService,
  ) {}
  async execute(command: DeleteCommentCommand) {
    const comment: CommentDocument = await this.commentQ.getOneComment(
      command.commentId,
    );
    if (!comment) throw new Errors.NOT_FOUND();
    if (comment.commentatorInfo.userId !== command.userId) {
      throw new Errors.FORBIDDEN();
    }
    const result = await this.commentService.deleteOneCommentById(
      command.commentId,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
