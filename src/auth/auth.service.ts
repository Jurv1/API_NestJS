import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.database.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
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
      const user = await this.userQ.getOneByConfirmationCode(code);
      if (!user) return false;
      if (user.emailConfirmation.isConfirmed) return false;
      if (user.emailConfirmation.confirmationCode !== code) return false;
      if (user.emailConfirmation.expirationDate < new Date()) return false;

      return await this.usersRepository.updateEmailConfirmation(user._id);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async resendConfirmationEmail(email: string) {
    const user = await this.userQ.getOneByLoginOrEmail(email);
    if (!user || !user.emailConfirmation.confirmationCode) return false;
    const newRegistrationCode = uuidv4();
    try {
      await emailManager.sendEmailConfirmationMessage(
        user,
        newRegistrationCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }
    return await this.usersRepository.updateConfirmationCode(
      user._id,
      newRegistrationCode,
    );
  }
}
