import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { PostMapper } from '../../../../../application/utils/mappers/post.mapper';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { Errors } from '../../../../../application/utils/handle.error';
import { Post } from '../../../../../application/entities/posts/post.entity';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';

export class GetOnePostQueryCommand {
  constructor(public postId: string, public userId?: string) {}
}

@QueryHandler(GetOnePostQueryCommand)
export class GetOnePostQueryUseCase
  implements IQueryHandler<GetOnePostQueryCommand>
{
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly blogQ: BlogsQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}
  async execute(command: GetOnePostQueryCommand) {
    errorIfNan(command.postId);
    const result: Post[] = await this.postQ.getOnePost(command.postId);
    if (result.length === 0) throw new Errors.NOT_FOUND();

    const blog: Blog[] = await this.blogQ.getOneBlog(
      result[0].blog.id.toString(),
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    return await this.postMapper.mapPost(result, command.userId);
  }
}
