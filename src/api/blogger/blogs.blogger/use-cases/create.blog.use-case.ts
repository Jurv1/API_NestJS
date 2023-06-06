import { ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../application/infrastructure/blogs/blogs.service';
import { BlogDocument } from '../../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogMapper } from '../../../../application/utils/mappers/blog.mapper';
import { Errors } from '../../../../application/utils/handle.error';
import { UserIdAndLogin } from '../../../public/auth/dto/user-id.and.login';

export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public userData: UserIdAndLogin,
  ) {}
}
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogMapper: BlogMapper,
  ) {}
  async execute(command: CreateBlogCommand) {
    const result: BlogDocument = await this.blogService.createOneBlog(
      command.name,
      command.description,
      command.websiteUrl,
      command.userData.userId,
      command.userData.userLogin,
    );

    if (!result) throw new Errors.NOT_FOUND();

    return this.blogMapper.mapBlog(result);
  }
}
