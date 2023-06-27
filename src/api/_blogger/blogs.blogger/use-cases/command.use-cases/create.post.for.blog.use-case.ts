import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../../application/infrastructure/posts/posts.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { PostMapper } from '../../../../../application/utils/mappers/post.mapper';
import { PostDocument } from '../../../../../application/schemas/posts/schemas/posts.database.schema';
import { PostViewModel } from '../../../../../application/schemas/posts/schemas/post-view.model';
import { UserIdAndLogin } from '../../../../_public/auth/dto/user-id.and.login';
import { BlogQ } from '../../../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';
import { BlogDocument } from '../../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogsQueryRepository } from '../../../../../application/infrastructure/blogs/blogs.query.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
export class CreatePostForBlogCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public userData: UserIdAndLogin,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase
  implements ICommandHandler<CreatePostForBlogCommand>
{
  constructor(
    private readonly postService: PostService,
    private readonly postMapper: PostMapper,
    private readonly blogQ: BlogsQueryRepository,
  ) {}

  async execute(command: CreatePostForBlogCommand): Promise<PostViewModel> {
    errorIfNan(command.blogId);
    const blog: any = await this.blogQ.getOwnerIdAndBlogIdForBlogger(
      command.blogId,
    );
    if (blog.length === 0) throw new Errors.NOT_FOUND();
    if (blog[0].OwnerId !== command.userData.userId)
      throw new Errors.FORBIDDEN();
    const result: any = await this.postService.createOnePost(
      command.title,
      command.shortDescription,
      command.content,
      command.blogId,
      command.userData,
    );
    if (result.length === 0) throw new Errors.NOT_FOUND();
    return await this.postMapper.mapPost(result);
  }
}
