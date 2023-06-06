import { ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../../application/infrastructure/users/users.service';
import { UserDocument } from '../../../../application/schemas/users/schemas/users.database.schema';
import { Errors } from '../../../../application/utils/handle.error';
import { UserMapper } from '../../../../application/utils/mappers/user.mapper';
import { UserViewDto } from '../../../../application/dto/users/dto/user.view.dto';

export class CreateUserCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public confirmed: boolean,
  ) {}
}

export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UsersService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserViewDto> {
    const user: UserDocument = await this.userService.createOneUser(
      command.login,
      command.email,
      command.password,
      command.confirmed,
    );
    if (!user) throw new Errors.NOT_FOUND();
    return this.userMapper.mapUser(user);
  }
}
