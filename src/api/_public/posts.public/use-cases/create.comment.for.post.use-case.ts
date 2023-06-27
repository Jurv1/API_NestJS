import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../application/infrastructure/posts/posts.service';
import { CommentMapper } from '../../../../application/utils/mappers/comment.mapper';
import { CommentDocument } from '../../../../application/schemas/comments/schemas/comments.database.schema';
import { Errors } from '../../../../application/utils/handle.error';
import { PostQ } from '../../../../application/infrastructure/posts/_Mongo/posts.query.repository';
import { PostDocument } from '../../../../application/schemas/posts/schemas/posts.database.schema';
import { BlogDocument } from '../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogQ } from '../../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';
import { BannedUserDto } from '../../../../application/dto/blogs/dto/banned.user.dto';

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
    private readonly postQ: PostQ,
    private readonly blogQ: BlogQ,
    private readonly commentMapper: CommentMapper,
  ) {}
  async execute(command: CreateCommentForPostCommand) {
    const post: PostDocument = await this.postQ.getOnePost(command.postId);
    const blog: BlogDocument = await this.blogQ.getOneBlog(post.blogId);
    blog.bannedUsersForBlog.forEach((el: BannedUserDto) => {
      if (el.id == command.userId) throw new Errors.FORBIDDEN();
    });
    const result: CommentDocument =
      await this.postService.createOneCommentByPostId(
        command.postId,
        command.content,
        command.userId,
        command.userLogin,
      );
    if (!result) throw new Errors.NOT_FOUND();
    return await this.commentMapper.mapComment(result);
  }
}
