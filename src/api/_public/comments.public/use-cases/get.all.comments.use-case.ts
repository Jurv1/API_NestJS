import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentMapper } from '../../../../application/utils/mappers/comment.mapper';
import { JwtService } from '@nestjs/jwt';
import { CommentQ } from '../../../../application/infrastructure/comments/comments.query.repository';
import { CommentDocument } from '../../../../application/schemas/comments/schemas/comments.database.schema';
import { CommentViewModel } from '../../../../application/schemas/comments/schemas/comment-view.model';
import { Errors } from '../../../../application/utils/handle.error';

export class GetCommentByIdCommand {
  constructor(public commentId: string, public token: string) {}
}
@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase
  implements ICommandHandler<GetCommentByIdCommand>
{
  constructor(
    private readonly commentMapper: CommentMapper,
    private readonly jwtService: JwtService,
    private readonly commentQ: CommentQ,
  ) {}

  async execute(command: GetCommentByIdCommand): Promise<CommentViewModel> {
    let userId = null;
    const payload: any | null =
      (await this.jwtService.decode(command.token)) || null;
    const comment: CommentDocument = await this.commentQ.getOneComment(
      command.commentId,
    );

    if (!comment) {
      throw new Errors.NOT_FOUND();
    }
    if (payload) {
      userId = payload.userId;
    }

    return await this.commentMapper.mapComment(comment, userId);
  }
}
