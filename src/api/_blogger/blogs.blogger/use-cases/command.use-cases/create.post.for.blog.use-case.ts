import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../../application/infrastructure/posts/posts.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { PostMapper } from '../../../../../application/utils/mappers/post.mapper';
import { PostViewModel } from '../../../../../application/schemas/posts/schemas/post-view.model';
import { UserIdAndLogin } from '../../../../_public/auth/dto/user-id.and.login';
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
    if (blog[0].ownerId !== command.userData.userId)
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
