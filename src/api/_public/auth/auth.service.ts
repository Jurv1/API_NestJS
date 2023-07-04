import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../application/infrastructure/users/users.service';
import { UserDocument } from '../../../application/schemas/users/schemas/users.database.schema';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { jwtConstants } from '../../../application/config/consts';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenBlacklist,
  RefreshTokenBlackListModel,
  TokenBlackListDocument,
} from '../../../application/schemas/devices/schemas/refresh-token.blacklist';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly userQ: UsersQueryRepository,
    private readonly mailService: MailService,
  ) {}
  async validateUser(login: string, password: string) {
    const user: any = await this.userService.findUserByLogin(login);

    if (user.length !== 0) {
      const isPasswordLegit = await bcrypt.compare(password, user[0].Password);
      if (isPasswordLegit) {
        return user;
      }
    }

    return null;
  }

  async login(user: UserDocument) {
    const accessPayload = {
      username: user[0].Login,
      userId: user[0].Id,
    };
    const refreshPayload = {
      username: user[0].Login,
      userId: user[0].Id,
      deviceId: uuidv4(),
    };
    return {
      access_token: this.jwtService.sign(accessPayload, {
        expiresIn: jwtConstants.accessTokenTime10s,
      }),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: jwtConstants.refreshTokenTime20s,
      }),
    };
  }

  async confirmEmail(code: string): Promise<boolean> {
    try {
      const user: any = await this.userQ.getOneByConfirmationCode(code);
      if (user.length === 0) return false;
      if (user[0].IsConfirmed) return false;
      if (user[0].ConfirmationCode !== code) return false;
      if (user[0].ExpirationDate < new Date()) return false;
      await this.userService.updateConfirmedFieldInUsers(user[0].Id, true);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async resendConfirmationEmail(email: string) {
    const user: any = await this.userQ.getOneByLoginOrEmail(email);
    if (user.length === 0 || user[0].IsConfirmed) return false;
    const newRegistrationCode = uuidv4();
    await this.userService.updateEmailConfirmation(
      user[0].Id,
      newRegistrationCode,
    );
    try {
      await this.mailService.sendUserConfirmation(
        user[0].Email,
        'Please, to continue work with our service confirm your email',
        user[0].Login,
        newRegistrationCode,
      );
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  async getDeviceIdFromRefresh(token: string) {
    const decodedToken: any = await this.jwtService.decode(token);
    return decodedToken.deviceId;
  }

  async getUserIdByToken(token: string) {
    const decodedToken: any = await this.jwtService.decode(token);
    return decodedToken.userId;
  }

  async getTokenPayload(token: string) {
    return this.jwtService.decode(token);
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

  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET,
    });
  }
}
