import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentMapper } from '../../../../application/utils/mappers/comment.mapper';
import { JwtService } from '@nestjs/jwt';
import { CommentViewModel } from '../../../../application/schemas/comments/schemas/comment-view.model';
import { Errors } from '../../../../application/utils/handle.error';
import { CommentsQueryRepository } from '../../../../application/infrastructure/comments/comments.query.repository';

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
    private readonly commentQ: CommentsQueryRepository,
  ) {}

  async execute(command: GetCommentByIdCommand): Promise<CommentViewModel> {
    let userId = null;
    const payload: any | null =
      (await this.jwtService.decode(command.token)) || null;
    const comment: any = await this.commentQ.getOneComment(command.commentId);

    if (comment.length === 0) {
      throw new Errors.NOT_FOUND();
    }
    if (payload) {
      userId = payload.userId;
    }

    return await this.commentMapper.mapComment(comment, userId);
  }
}
