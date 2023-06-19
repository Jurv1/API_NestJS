import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../application/utils/handle.error';
import { UsersRepository } from '../../../../application/infrastructure/users/users.repository';
export class DeleteUserBySuperAdminCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserBySuperAdminCommand)
export class DeleteUserBySuperAdminUseCase
  implements ICommandHandler<DeleteUserBySuperAdminCommand>
{
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(command: DeleteUserBySuperAdminCommand) {
    const result: boolean = await this.userRepository.deleteOne(command.userId);
    if (!result) throw new Errors.NOT_FOUND();
    return result;
  }
}
