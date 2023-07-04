import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { CommentMapper } from '../../../../../application/utils/mappers/comment.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';

export class GetAllCommentsByPostIdQueryCommand {
  constructor(
    public postId: string,
    public sort: { [key: string]: string },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    public userId?: string,
  ) {}
}

@QueryHandler(GetAllCommentsByPostIdQueryCommand)
export class GetAllCommentsByPostIdUseCase
  implements IQueryHandler<GetAllCommentsByPostIdQueryCommand>
{
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly commentsMapper: CommentMapper,
  ) {}
  async execute(command: GetAllCommentsByPostIdQueryCommand) {
    errorIfNan(command.postId);
    const allComments = await this.postQ.getAllCommentsByPostId(
      command.postId,
      command.sort,
      command.pagination,
      command.userId,
    );
    const counts = await this.postQ.countAllCommentsByPostId(command.postId);

    const mappedComments = await this.commentsMapper.mapComments(
      allComments,
      command.userId,
    );

    return paginator(
      +counts,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedComments,
    );
  }
}
