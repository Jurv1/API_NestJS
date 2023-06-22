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
import { CurrentUserId } from './decorators/current-user.param.decorator';
import { UserDocument } from '../../../application/schemas/users/schemas/users.database.schema';
import { CurrentUserData } from './decorators/current-user.data';
import { UserLoginDataDto } from './dto/user-login-data.dto';
import { UserGetMeDataDto } from './dto/user-get-me-data.dto';
import { DevicesService } from '../../../application/infrastructure/devices/devices.service';
import { UsersService } from '../../../application/infrastructure/users/users.service';
import { Errors } from '../../../application/utils/handle.error';
import { CurrentRefreshToken } from './decorators/current-refresh-token';
import { UserBody } from '../../../application/dto/users/dto/user.body';
import { EmailDto } from './dto/email.dto';
import { NewPasswordDto } from './dto/new.password.dto';
import { CustomGuardForRefreshToken } from './guards/custom.guard.for.refresh.token';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UsersQueryRepository } from '../../../application/infrastructure/users/users.query.repository';

@Controller('auth')
export class PublicAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQ: UsersQueryRepository,
    private readonly userService: UsersService,
    private readonly deviceService: DevicesService,
  ) {}

  @Throttle(5, 10)
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
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
      email: user[0].Email,
      login: user[0].Login,
      userId: currentUserId.toString(),
    };
  }

  @Throttle(5, 10)
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('registration')
  async registerMe(@Body() body: UserBody) {
    const { login, password, email } = body;

    const isLoginExists: any = await this.userQ.getOneByLoginOrEmail(login);
    if (isLoginExists.length !== 0) {
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'login',
          },
        ],
      });
    }

    const isEmailExists: any = await this.userQ.getOneByLoginOrEmail(email);
    if (isEmailExists.length !== 0) {
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'email',
          },
        ],
      });
    }

    const user: any = await this.userService.createOneUser(
      login,
      email,
      password,
      false,
    );
    if (user.length !== 0) {
      return { message: 'all good' };
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
  async recoverMyPassword(@Body() body: EmailDto) {
    await this.userService.makePasswordRecoveryMail(body.email);

    return;
  }

  @Post('new-password')
  async makeNewPassword(@Body() body: NewPasswordDto) {
    const { newPassword, recoveryCode } = body;

    await this.userService.updateNewPassword(newPassword, recoveryCode);

    return;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @HttpCode(204)
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
      } else {
        return { message: 'all good' };
      }
    } catch (err) {
      console.log(err);
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'code',
          },
        ],
      });
    }
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  @HttpCode(204)
  @Post('registration-email-resending')
  async resendRegistrationConfirming(@Body() body: EmailDto) {
    try {
      const result = await this.authService.resendConfirmationEmail(body.email);
      if (!result) {
        throw new Errors.BAD_REQUEST({
          errorsMessages: [
            {
              message: 'Something went wrong',
              field: 'email',
            },
          ],
        });
      }

      return { message: 'all good' };
    } catch (err) {
      console.log(err);
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'email',
          },
        ],
      });
    }
  }

  @UseGuards(CustomGuardForRefreshToken)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshMyToken(@Response() res, @CurrentRefreshToken() refreshToken) {
    const isTokenValid = await this.authService.verifyToken(refreshToken);
    if (!isTokenValid) {
      throw new Errors.UNAUTHORIZED();
    }
    const userId = await this.authService.getUserIdByToken(refreshToken);
    if (userId) {
      const user: any = await this.userQ.getOneUserById(userId.toString());
      const deviceId = await this.authService.getDeviceIdFromRefresh(
        refreshToken,
      );
      const accessToken = await this.authService.createAccessToken(
        userId,
        user[0].Login,
        '10s',
      );
      const newRefreshToken = await this.authService.createRefreshToken(
        userId,
        user[0].Login,
        deviceId,
        '20s',
      );
      const iatFromToken: number = await this.authService.getIatFromToken(
        newRefreshToken,
      );

      await this.deviceService.updateDeviceIat(deviceId, iatFromToken);

      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .header('Authorization', accessToken)
        .send({ accessToken: accessToken });
    } else return res.sendStatus(401);
  }

  //@UseGuards(ThrottlerGuard)
  //@Throttle(5, 10)
  @UseGuards(CustomGuardForRefreshToken)
  @HttpCode(204)
  @Post('logout')
  async logOut(@CurrentRefreshToken() refresh: string) {
    if (!refresh) return new Errors.UNAUTHORIZED();

    const deviceId = await this.authService.getDeviceIdFromRefresh(refresh);
    await this.deviceService.deleteOneDeviceById(deviceId);
    return;
  }
}
