import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { PostMapper } from '../../../../../application/utils/mappers/post.mapper';
import { paginator } from '../../../../../application/utils/paginator/paginator';

export class GetAllPostsQueryCommand {
  constructor(
    public filter: { [key: string]: string | boolean },
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

@QueryHandler(GetAllPostsQueryCommand)
export class GetAllPostsQueryUseCase
  implements IQueryHandler<GetAllPostsQueryCommand>
{
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}
  async execute(command: GetAllPostsQueryCommand) {
    const allPosts = await this.postQ.getAllPosts(
      command.filter,
      command.sort,
      command.pagination,
      command.userId,
    );

    const mappedPosts = await this.postMapper.mapPosts(
      allPosts,
      command.userId,
    );
    const countedPosts = await this.postQ.countAllPosts();
    return paginator(
      +countedPosts,
      command.pagination.pageSize,
      command.pagination.pageNumber,
      mappedPosts,
    );
  }
}
