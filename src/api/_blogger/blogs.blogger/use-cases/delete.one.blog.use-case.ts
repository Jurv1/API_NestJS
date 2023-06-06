import { ICommandHandler } from '@nestjs/cqrs';
import { BlogService } from '../../../../application/infrastructure/blogs/blogs.service';
import { Errors } from '../../../../application/utils/handle.error';

export class DeleteOneBlogCommand {
  constructor(public blogId: string) {}
}
export class DeleteOneBlogUseCase
  implements ICommandHandler<DeleteOneBlogCommand>
{
  constructor(private readonly blogService: BlogService) {}

  async execute(command: DeleteOneBlogCommand) {
    const result: boolean = await this.blogService.deleteOneBlog(
      command.blogId,
    );
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
