import {
  Controller,
  Post,
  UseGuards,
  Response,
  Get,
  HttpCode,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUserId } from './current-user.param.decorator';
import { UserQ } from '../users/users.query.repository';
import { UserDocument } from '../users/schemas/users.database.schema';
import { CurrentUserData } from './current-user.data';
import { UserLoginDataDto } from './dto/user-login-data.dto';
import { UserGetMeDataDto } from './dto/user-get-me-data.dto';
import { DevicesService } from '../devices/devices.service';
import { UsersService } from '../users/users.service';
import { Errors } from '../utils/handle.error';
import { CurrentRefreshToken } from './current-refresh-token';
import { DeviceQ } from '../devices/devices.query.repository';
import { DeviceDocument } from '../devices/schemas/devices.database.schema';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UserBody } from '../users/dto/user.body';
import { EmailDto } from './dto/email.dto';
import { NewPasswordDto } from './dto/new.password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQ: UserQ,
    private readonly userService: UsersService,
    private readonly deviceService: DevicesService,
    private readonly deviceQ: DeviceQ,
  ) {}

  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Throttle(5, 10)
  @HttpCode(200)
  @Post('login')
  async login(
    @CurrentUserData() currentUserData: UserLoginDataDto,
    @Response() res,
  ) {
    const user: UserDocument = await this.userQ.getOneUserById(
      currentUserData.userId,
    );

    const tokens = await this.authService.login(user);
    await this.deviceService.createNewDevice(
      currentUserData,
      tokens.refresh_token,
    );

    res
      .cookie('refreshToken', tokens.refresh_token, {})
      .header('Authorization', tokens.access_token)
      .send({
        accessToken: tokens.access_token,
      });
  }
  //httpOnly: true,
  //         secure: true,
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUserId() currentUserId): Promise<UserGetMeDataDto> {
    const user: UserDocument = await this.userQ.getOneUserById(currentUserId);
    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: currentUserId,
    };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('registration')
  async registerMe(@Body() body: UserBody) {
    const { login, password, email } = body;

    const user: UserDocument = await this.userService.createOneUser(
      login,
      email,
      password,
      false,
    );
    if (user) {
      return;
    } else {
      throw new Errors.BAD_REQUEST({
        errorsMessages: {
          message: 's',
          field: 'login',
        },
      });
    }
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('password-recovery')
  async recoverMyPassword(@Body() body: EmailDto) {
    await this.userService.makePasswordRecoveryMail(body.email);

    return;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('new-password')
  async makeNewPassword(@Body() body: NewPasswordDto) {
    const { newPassword, recoveryCode } = body;

    await this.userService.updateNewPassword(newPassword, recoveryCode);

    return;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('registration-confirmation')
  async confirmRegistration(@Body('code') code: string) {
    try {
      const result = await this.authService.confirmEmail(code);
      if (!result) {
        throw new Errors.BAD_REQUEST({
          errorsMessages: [
            {
              message: 'Something went wrong',
              field: 'code',
            },
          ],
        });
      }

      return;
    } catch (err) {
      console.log(err);
      throw new Errors.BAD_REQUEST();
    }
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('registration-email-resending')
  async resendRegistrationConfirming(@Body() body: EmailDto) {
    const result = await this.authService.resendConfirmationEmail(body.email);
    if (!result) {
      return new Errors.BAD_REQUEST();
    }

    return;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('refresh-token')
  async refreshMyToken(@Response() res, @CurrentRefreshToken() refreshToken) {
    const userId = await this.authService.getUserIdByToken(refreshToken);

    if (userId) {
      const user: UserDocument = await this.userQ.getOneUserById(
        userId.toString(),
      );
      const deviceId = await this.authService.getDeviceIdFromRefresh(
        refreshToken,
      );
      const accessToken = await this.authService.createAccessToken(
        userId,
        user.accountData.login,
        '10s',
      );
      const newRefreshToken = await this.authService.createRefreshToken(
        userId,
        user.accountData.login,
        deviceId,
        '20s',
      );
      const iatFromToken: number = await this.authService.getIatFromToken(
        newRefreshToken,
      );
      const device: DeviceDocument = await this.deviceQ.getOneDeviceById(
        deviceId,
      );

      await device.updateLastActiveDate(iatFromToken);

      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .header('Authorization', accessToken)
        .json({ accessToken: accessToken });
    } else return res.sendStatus(401);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @Post('logout')
  async logOut(@CurrentRefreshToken() refresh: string) {
    if (!refresh) return new Errors.UNAUTHORIZED();

    const payload = await this.authService.getDeviceIdFromRefresh(refresh);
    await this.deviceService.deleteOneDeviceById(payload.deviceId);

    return;
  }
}
