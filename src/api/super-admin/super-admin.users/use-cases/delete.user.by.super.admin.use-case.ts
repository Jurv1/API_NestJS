import { ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../application/infrastructure/users/users.repository';
import { Errors } from '../../../../application/utils/handle.error';
export class DeleteUserBySuperAdminCommand {
  constructor(public userId: string) {}
}
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
