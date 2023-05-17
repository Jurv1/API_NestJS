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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQ: UserQ,
    private readonly userService: UsersService,
    private readonly deviceService: DevicesService,
  ) {}

  @UseGuards(LocalAuthGuard)
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
      .cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
      })
      .header('Authorization', tokens.access_token)
      .send({
        accessToken: tokens.access_token,
      });
  }

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

  @Post('registration')
  async registerMe(@Body() body) {
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

  @Post('password-recovery')
  async recoverMyPassword(@Body('email') email: string) {
    await this.userService.makePasswordRecoveryMail(email);

    return;
  }

  @Post('new-password')
  async makeNewPassword(@Body() body) {
    const { newPassword, recoveryCode } = body;

    await this.userService.updateNewPassword(newPassword, recoveryCode);

    return;
  }

  @Post('registration-confirmation')
  async confirmRegistration(@Body('code') code: string) {
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
  }

  @Post('registration-email-resending')
  async resendRegistrationConfirming(@Body('email') email: string) {
    const result = await this.authService.resendConfirmationEmail(email);
    if (!result) {
      return new Errors.BAD_REQUEST();
    }

    return;
  }

  // @Post('refresh-token')
  // async refreshMyToken(@Response() res) {
  //   const refreshToken = req.cookies.refreshToken;
  //
  //   const userId = await this.jwtService.getUserIdByToken(refreshToken);
  //
  //   if (userId) {
  //     const user = await this.userQ.getOneUserById(userId.toString());
  //     const payload = await this.jwtService.getPayload(refreshToken);
  //     const accessToken = await this.jwtService.createJWT(
  //       user!,
  //       payload.deviceId,
  //       '10s',
  //     );
  //     const newRefreshToken = await this.jwtService.createJWT(
  //       user!,
  //       payload.deviceId,
  //       '20s',
  //     );
  //     const newRefreshTokenPayload = await this.jwtService.getPayload(
  //       newRefreshToken,
  //     );
  //     await this.devicesRepository.updateLastActivity(newRefreshTokenPayload);
  //
  //     res
  //       .cookie('refreshToken', newRefreshToken, {
  //         httpOnly: true,
  //         secure: true,
  //       })
  //       .header('Authorization', accessToken)
  //       .json({ accessToken: accessToken });
  //   } else return res.sendStatus(401);
  // }
  //
  // @Post('logout')
  // async logOut(req: Request, res: Response) {
  //   const refreshToken = req.cookies.refreshToken;
  //   if (!refreshToken) return res.sendStatus(401);
  //
  //   const payload = await this.jwtService.getPayload(refreshToken);
  //   await this.deviceService.deleteOneDeviceById(payload.deviceId);
  //
  //   return;
  // }
}
