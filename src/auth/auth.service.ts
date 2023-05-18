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
    const accessPayload = {
      username: user.accountData.login,
      userId: user._id,
    };
    const refreshPayload = {
      username: user.accountData.login,
      userId: user._id,
      deviceId: uuidv4(),
    };
    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload),
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

  async getDeviceIdFromRefresh(token: any) {
    const decodedToken: any = await this.jwtService.decode(token);
    return decodedToken.deviceId;
  }

  async getUserIdByToken(token: any) {
    const decodedToken: any = await this.jwtService.decode(token);
    return decodedToken.userId;
  }

  async createAccessToken(userId: string, userLogin: string, time: string) {
    const accessPayload = { username: userLogin, userId: userId };
    return this.jwtService.sign(accessPayload, {
      expiresIn: time,
    });
  }

  async createRefreshToken(
    userId: string,
    userLogin: string,
    deviceId: string,
    time: string,
  ) {
    const refreshPayload = {
      username: userLogin,
      userId: userId,
      deviceId: deviceId,
    };

    return this.jwtService.sign(refreshPayload, {
      expiresIn: time,
    });
  }

  async getIatFromToken(token: any) {
    const decodedToken: any = this.jwtService.decode(token);
    return decodedToken.iat;
  }
}
