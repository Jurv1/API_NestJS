import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { UserCreationDto } from './dto/user.creation.dto';
import { UserDocument } from './schemas/users.database.schema';
import { UserQ } from './users.query.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userQ: UserQ,
  ) {}
  async createOneUser(
    login: string,
    email: string,
    password: string,
    confirmed: boolean,
  ): Promise<UserDocument | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const userDto: UserCreationDto = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      isConfirmed: confirmed,
    };

    return await this.usersRepository.createOne(userDto);
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return await this.userQ.getOneUserByLogin(login);
  }

  async deleteOneUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteOne(id);
  }
}
