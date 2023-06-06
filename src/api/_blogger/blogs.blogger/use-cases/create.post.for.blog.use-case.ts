import { ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../../../application/infrastructure/posts/posts.service';
import { Errors } from '../../../../application/utils/handle.error';
import { PostMapper } from '../../../../application/utils/mappers/post.mapper';
import { PostDocument } from '../../../../application/schemas/posts/schemas/posts.database.schema';
import { PostViewModel } from '../../../../application/schemas/posts/schemas/post-view.model';
import { UserIdAndLogin } from '../../../_public/auth/dto/user-id.and.login';
export class CreatePostForBlogCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public userData: UserIdAndLogin,
  ) {}
}
export class CreatePostForBlogUseCase
  implements ICommandHandler<CreatePostForBlogCommand>
{
  constructor(
    private readonly postService: PostService,
    private readonly postMapper: PostMapper,
  ) {}

  async execute(command: CreatePostForBlogCommand): Promise<PostViewModel> {
    const result: PostDocument = await this.postService.createOnePost(
      command.title,
      command.shortDescription,
      command.content,
      command.blogId,
      command.userData,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return await this.postMapper.mapPost(result);
  }
}
