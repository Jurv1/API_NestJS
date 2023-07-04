import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../../../../application/infrastructure/comments/comments.query.repository';
import { CommentMapper } from '../../../../../application/utils/mappers/comment.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllCommentsForBloggerQueryCommand {
  constructor(
    public userId: string,
    public sort: { [key: string]: string },
    public pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {}
}

@QueryHandler(GetAllCommentsForBloggerQueryCommand)
export class GetAllCommentsForBloggerQueryUseCase
  implements IQueryHandler<GetAllCommentsForBloggerQueryCommand>
{
  constructor(
    private readonly commentsQ: CommentsQueryRepository,
    private readonly commentsMapper: CommentMapper,
  ) {}
  async execute(command: GetAllCommentsForBloggerQueryCommand) {
    const allComments = await this.commentsQ.getCommentsForBlog(
      command.userId,
      command.sort,
      command.pagination,
    );
    const counts = await this.commentsQ.countAllComments(command.userId);
    const mappedComments = await this.commentsMapper.mapCommentsForBlogger(
      allComments,
    );
    return paginator(
      +counts,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedComments,
    );
  }
}
