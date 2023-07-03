import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../../application/infrastructure/posts/posts.service';
import { CommentMapper } from '../../../../../application/utils/mappers/comment.mapper';
import { Errors } from '../../../../../application/utils/handle.error';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';

export class CreateCommentForPostCommand {
  constructor(
    public postId: string,
    public content: string,
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(
    private readonly postService: PostService,
    private readonly postQ: PostsQueryRepository,
    private readonly blogQ: BlogsQueryRepository,
    private readonly commentMapper: CommentMapper,
  ) {}
  async execute(command: CreateCommentForPostCommand) {
    errorIfNan(command.postId);

    const post: any = await this.postQ.getOnePost(command.postId);
    const bannedUsers = await this.blogQ.getAllBannedForBlogWithoutFilters(
      post[0].BlogId,
    );
    bannedUsers.forEach((el) => {
      if (el.Id == command.userId) throw new Errors.FORBIDDEN();
    });
    const result: any = await this.postService.createOneCommentByPostId(
      command.postId,
      command.content,
      command.userId,
      command.userLogin,
    );
    if (result.length === 0) throw new Errors.NOT_FOUND();
    return await this.commentMapper.mapComment(result);
  }
}
