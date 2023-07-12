import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../../../application/infrastructure/users/users.service';
import { UserMapper } from '../../../../../application/utils/mappers/user.mapper';
import { UserViewDto } from '../../../../../application/dto/users/dto/user.view.dto';
import { User } from '../../../../../application/entities/users/user.entity';

export class CreateUserCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public confirmed: boolean,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UsersService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserViewDto> {
    const user: User = await this.userService.createOneUser(
      command.login,
      command.email,
      command.password,
      command.confirmed,
    );
    return this.userMapper.mapUser(user);
  }
}
