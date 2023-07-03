import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { CommentsQueryRepository } from '../../../../../application/infrastructure/comments/comments.query.repository';
import { CommentsRepository } from '../../../../../application/infrastructure/comments/comments.repository';
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
  constructor(
    private readonly commentQ: CommentsQueryRepository,
    private readonly commentsRepo: CommentsRepository,
  ) {}
  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentQ.getOneComment(command.commentId);
    if (comment.length === 0) {
      throw new Errors.NOT_FOUND();
    }

    if (comment[0].CommentatorId !== command.userId) {
      throw new Errors.FORBIDDEN();
    }
    return await this.commentsRepo.updateCommentById(
      command.commentId,
      command.content,
    );
  }
}
