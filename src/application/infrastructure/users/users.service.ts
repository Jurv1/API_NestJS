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

    const result: UserDocument = await this.usersRepository.createOne(userDto);
    if (!confirmed) {
      await this.usersRepository.updateEmailConfirmation(result[0].Id);
      const confirmationCode = await this.userQ.getConfirmationCodeByUserId(
        result[0].Id,
      );
      if (result) {
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

  async updatePassInfo(
    user: UserDocument,
    recoveryCode: string,
    expirationDate: Date,
  ) {
    const recoveryCodeDto = {
      recoveryCode,
      expirationDate,
    };
    await user.updateRecoveryCode(recoveryCodeDto);

    return true;
  }

  async makePasswordRecoveryMail(email: string) {
    const user: UserDocument = await this.userQ.getOneByLoginOrEmail(email);

    if (!user) return false;
    //const userId = user._id.toString();
    const recoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    });
    await this.updatePassInfo(user, recoveryCode, expirationDate);

    try {
      await this.mailService.sendPasswordRecoveryMessage(
        user.accountData.email,
        'Password Recovery',
        user.accountData.login,
        recoveryCode,
      );
    } catch (err) {
      console.log(err);
      return null;
    }

    return true;
  }

  async updateNewPassword(pass: string, code: string) {
    const user = await this.userQ.getOneByPassCode(code);
    if (!user) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, passwordSalt);

    const updatePasswordDto: UpdatePasswordDto = {
      passwordHash,
      passwordSalt,
    };

    await user.updatePassword(updatePasswordDto);
    return true;
  }
}
