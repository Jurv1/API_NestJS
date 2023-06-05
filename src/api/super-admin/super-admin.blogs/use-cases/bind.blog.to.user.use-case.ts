import { ICommandHandler } from '@nestjs/cqrs';
import { UserQ } from '../../../../users/users.query.repository';
import { BlogQ } from '../../../../blogs/blogs.query.repository';
import { BlogDocument } from '../../../../blogs/schemas/blogs.database.schema';
import { Errors } from '../../../../utils/handle.error';
import { UserDocument } from '../../../../users/schemas/users.database.schema';

export class BindBlogToUserCommand {
  constructor(public blogId: string, public UserId: string) {}
}
export class BindBlogToUserUseCase
  implements ICommandHandler<BindBlogToUserCommand>
{
  constructor(private readonly userQ: UserQ, private readonly blogQ: BlogQ) {}

  async execute(command: BindBlogToUserCommand) {
    const blog: BlogDocument = await this.blogQ.getOneBlog(command.blogId);
    if (!blog) throw new Errors.NOT_FOUND();
    if (blog.ownerInfo.userId) throw new Errors.BAD_REQUEST();
    const user: UserDocument = await this.userQ.getOneUserById(command.UserId);
    if (!user) throw new Errors.NOT_FOUND();
    await blog.bindUser(user.id, user.accountData.login);
    await blog.save();
    return;
  }
}
