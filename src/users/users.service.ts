import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async createOneUser(
    login: string,
    email: string,
    password: string,
    confirmed: boolean,
  ): Promise<any | null> {
    console.log(bcrypt);
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const newUserTmp = {
      accountData: {
        login: login,
        email: email,
        password: passwordHash,
        passwordSalt: passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: new Date(),
        isConfirmed: confirmed,
      },
      passRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    };
    return await this.usersRepository.createOne(newUserTmp);
  }

  async deleteOneUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteOne(id);
  }
}
