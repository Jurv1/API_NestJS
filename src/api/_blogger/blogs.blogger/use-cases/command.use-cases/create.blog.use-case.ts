import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { UserIdAndLogin } from '../../../../_public/auth/dto/user-id.and.login';
import { BlogMapper } from '../../../../../application/utils/mappers/blog.mapper';
import { Blog } from '../../../../../application/entities/blogs/blog.entity';

export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public userData: UserIdAndLogin,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: CreateBlogCommand) {
    const result: Blog[] = await this.blogService.createOneBlog(
      command.name,
      command.description,
      command.websiteUrl,
      command.userData.userId,
      command.userData.userLogin,
    );

    if (result.length === 0) throw new Errors.NOT_FOUND();

    return this.blogMapper.mapBlog(result);
  }
}
