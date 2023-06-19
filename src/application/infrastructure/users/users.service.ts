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

    const result: any = await this.usersRepository.createOne(userDto);
    if (!confirmed) {
      await this.updateEmailConfirmation(result[0].Id, uuidv4());
      const confirmationCode = await this.userQ.getConfirmationCodeByUserId(
        result[0].Id,
      );
      if (result.length !== 0) {
        try {
          await this.mailService.sendUserConfirmation(
            result[0].Email,
            'Please, to continue work with our service confirm your email',
            result[0].Login,
            confirmationCode[0].ConfirmationCode,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
    return result;
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return await this.userQ.getOneUserByLogin(login);
  }

  async deleteOneUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteOne(id);
  }

  async makePasswordRecoveryMail(email: string) {
    const user: any = await this.userQ.getOneByLoginOrEmail(email);

    if (user.length === 0) return false;
    const recoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    });
    await this.usersRepository.updatePasswordConfirmation(
      user[0].Id,
      recoveryCode,
      expirationDate,
    );

    try {
      await this.mailService.sendPasswordRecoveryMessage(
        user[0].Email,
        'Password Recovery',
        user[0].Login,
        recoveryCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  async updateNewPassword(pass: string, code: string) {
    const user: any = await this.userQ.getOneByPassCode(code);
    if (user.length == 0) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, passwordSalt);

    const updatePasswordDto: UpdatePasswordDto = {
      passwordHash,
      passwordSalt,
    };

    await this.usersRepository.updatePassword(
      user[0].Id,
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
