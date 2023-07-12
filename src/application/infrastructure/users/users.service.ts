import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserCreationDto } from '../../dto/users/dto/user.creation.dto';
import { MailService } from '../../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from '../../dto/users/dto/update.password.dto';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { User } from '../../entities/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmationForUsers } from '../../entities/users/email.confirmation.for.users.entity';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly usersRepo: UsersRepository,
    private readonly userQ: UsersQueryRepository,
    private readonly mailService: MailService,
  ) {}
  async createOneUser(
    login: string,
    email: string,
    password: string,
    confirmed: boolean,
  ): Promise<User | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const userDto: UserCreationDto = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      isConfirmed: confirmed,
      isBanned: false,
      createdAt: new Date(),
    };

    const result: User = await this.usersRepository.save(userDto);
    await this.usersRepo.createBanInfoForNewUser(result);
    if (!confirmed) {
      await this.updateEmailConfirmation(result, uuidv4());
      const confirmationCode = await this.userQ.getConfirmationCodeByUserId(
        result.id,
      );
      try {
        await this.mailService.sendUserConfirmation(
          result.email,
          'Please, to continue work with our service confirm your email',
          result.login,
          confirmationCode.confirmationCode,
        );
      } catch (err) {
        console.log(err);
      }
    }
    return result;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    return await this.userQ.getOneUserByLogin(login);
  }

  async deleteOneUser(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result[1] === 1;
  }

  async makePasswordRecoveryMail(email: string) {
    const user: User = await this.userQ.getOneByLoginOrEmail(email);

    if (!user) return false;
    const recoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    });
    await this.usersRepo.updatePasswordConfirmation(
      user.id.toString(),
      recoveryCode,
      expirationDate,
    );

    try {
      await this.mailService.sendPasswordRecoveryMessage(
        user.email,
        'Password Recovery',
        user.login,
        recoveryCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  async updateNewPassword(pass: string, code: string) {
    const user: User = await this.userQ.getOneByPassCode(code);
    if (!user) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, passwordSalt);

    const updatePasswordDto: UpdatePasswordDto = {
      passwordHash,
      passwordSalt,
    };

    await this.usersRepo.updatePassword(
      user.id.toString(),
      updatePasswordDto.passwordHash,
      updatePasswordDto.passwordSalt,
    );
    return true;
  }

  async updateConfirmedFieldInUsers(id: string, isConf: boolean) {
    await this.usersRepo.updateConfirmationInUsers(id, isConf);
  }

  async updateEmailConfirmation(user: User, code: string) {
    const emailInfo: EmailConfirmationForUsers =
      new EmailConfirmationForUsers();
    emailInfo.user = user;
    emailInfo.confirmationCode = code;
    emailInfo.expirationDate = add(new Date(), { hours: 1, minutes: 3 });

    await this.usersRepo.updateEmailConfirmation(emailInfo);
  }
}
