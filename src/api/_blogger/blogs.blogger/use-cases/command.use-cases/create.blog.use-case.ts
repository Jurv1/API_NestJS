import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../../application/utils/handle.error';
import { UserIdAndLogin } from '../../../../_public/auth/dto/user-id.and.login';

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
  constructor(private readonly blogService: BlogService) {}
  async execute(command: CreateBlogCommand) {
    const result: any = await this.blogService.createOneBlog(
      command.name,
      command.description,
      command.websiteUrl,
      command.userData.userId,
      command.userData.userLogin,
    );

    if (result.length === 0) throw new Errors.NOT_FOUND();

    return result;
  }
}
