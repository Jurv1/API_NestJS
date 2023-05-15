import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.database.schema';
import * as bcrypt from 'bcrypt';
import { UserQ } from '../users/users.query.repository';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly userQ: UserQ,
    private readonly mailService: MailService,
  ) {}
  async validateUser(login: string, password: string) {
    const user: UserDocument = await this.userService.findUserByLogin(login);

    if (user) {
      const isPasswordLegit = await bcrypt.compare(
        password,
        user.accountData.password,
      );
      if (isPasswordLegit) {
        return user;
      }
    }

    return null;
  }

  async login(user: UserDocument) {
    const payload = { username: user.accountData.login, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }

  async confirmEmail(code: string): Promise<boolean> {
    try {
      const user: UserDocument = await this.userQ.getOneByConfirmationCode(
        code,
      );
      if (!user) return false;
      if (user.emailConfirmation.isConfirmed) return false;
      if (user.emailConfirmation.confirmationCode !== code) return false;
      if (user.emailConfirmation.expirationDate < new Date()) return false;

      await user.updateEmailConfirmation(true);

      return;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async resendConfirmationEmail(email: string) {
    const user: UserDocument = await this.userQ.getOneByLoginOrEmail(email);
    if (!user || !user.emailConfirmation.confirmationCode) return false;
    const newRegistrationCode = uuidv4();
    try {
      await this.mailService.sendUserConfirmation(
        user.accountData.email,
        'Please, to continue work with our service confirm your email',
        user.accountData.login,
        newRegistrationCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }
    await user.updateEmailConfirmationCode(newRegistrationCode);
  }
}
