import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserCreationDto } from '../../dto/users/dto/user.creation.dto';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { MailService } from '../../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UpdatePasswordDto } from '../../dto/users/dto/update.password.dto';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { User } from '../../entities/users/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userQ: UsersQueryRepository,
    private readonly mailService: MailService,
  ) {}
  async createOneUser(
    login: string,
    email: string,
    password: string,
    confirmed: boolean,
  ): Promise<User[] | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const userDto: UserCreationDto = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      isConfirmed: confirmed,
    };

    const result: User[] = await this.usersRepository.createOne(userDto);
    if (!confirmed) {
      await this.updateEmailConfirmation(result[0].id.toString(), uuidv4());
      const confirmationCode = await this.userQ.getConfirmationCodeByUserId(
        result[0].id.toString(),
      );
      if (result.length !== 0) {
        try {
          await this.mailService.sendUserConfirmation(
            result[0].email,
            'Please, to continue work with our service confirm your email',
            result[0].login,
            confirmationCode[0].code,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
    return result;
  }

  async findUserByLogin(login: string): Promise<User[] | null> {
    return await this.userQ.getOneUserByLogin(login);
  }

  async deleteOneUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteOne(id);
  }

  async makePasswordRecoveryMail(email: string) {
    const user: User[] = await this.userQ.getOneByLoginOrEmail(email);

    if (user.length === 0) return false;
    const recoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    });
    await this.usersRepository.updatePasswordConfirmation(
      user[0].id.toString(),
      recoveryCode,
      expirationDate,
    );

    try {
      await this.mailService.sendPasswordRecoveryMessage(
        user[0].email,
        'Password Recovery',
        user[0].login,
        recoveryCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  async updateNewPassword(pass: string, code: string) {
    const user: User[] = await this.userQ.getOneByPassCode(code);
    if (user.length == 0) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, passwordSalt);

    const updatePasswordDto: UpdatePasswordDto = {
      passwordHash,
      passwordSalt,
    };

    await this.usersRepository.updatePassword(
      user[0].id.toString(),
      updatePasswordDto.passwordHash,
      updatePasswordDto.passwordSalt,
    );
    return true;
  }

  async updateConfirmedFieldInUsers(id: string, isConf: boolean) {
    await this.usersRepository.updateConfirmationInUsers(id, isConf);
  }

  async updateEmailConfirmation(id: string, code: string) {
    await this.usersRepository.updateEmailConfirmation(id, code);
  }
}
