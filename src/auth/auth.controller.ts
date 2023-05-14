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
import { v4 as uuidv4 } from 'uuid';
import { DevicesService } from '../devices/devices.service';
import { UsersService } from '../users/users.service';

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

    const deviceId = uuidv4();

    await this.deviceService.createNewDevice();

    const tokens = await this.authService.login(user);
    res
      .cookie('refreshToken', tokens.refresh_token, {})
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

  async registerMe(@Body() body) {
    const { login, password, email } = body;

    const user = await this.userService.createOneUser(
      login,
      email,
      password,
      false,
    );
    if (user) {
      res.sendStatus(204);
    } else {
      res.status(400).json({
        errorsMessages: {
          message: 's',
          field: 'login',
        },
      });
    }
  }

  async recoverMyPassword(@Body('email') email: string) {
    await this.userService.makePasswordRecoveryMail(email);

    res.status(204).send('Message sent');
  }

  async makeNewPassword(@Body() body) {
    const { newPassword, recoveryCode } = body;

    await this.userService.updateNewPassword(newPassword, recoveryCode);

    res.sendStatus(204);
  }

  async confirmRegistration(@Body('code') code: string) {
    const result = await this.authService.confirmEmail(code);
    if (!result) {
      res.status(400).json({
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'code',
          },
        ],
      });
      return;
    }

    res.sendStatus(204);
  }

  async resendRegistrationConfirming(@Body('email') email: string) {
    const result = await this.authService.resendConfirmationEmail(email);
    if (!result) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(204);
  }

  async refreshMyToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    const userId = await this.jwtService.getUserIdByToken(refreshToken);

    if (userId) {
      const user = await this.userQ.getOneUserById(userId.toString());
      const payload = await this.jwtService.getPayload(refreshToken);
      const accessToken = await this.jwtService.createJWT(
        user!,
        payload.deviceId,
        '10s',
      );
      const newRefreshToken = await this.jwtService.createJWT(
        user!,
        payload.deviceId,
        '20s',
      );
      const newRefreshTokenPayload = await this.jwtService.getPayload(
        newRefreshToken,
      );
      await this.devicesRepository.updateLastActivity(newRefreshTokenPayload);

      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .header('Authorization', accessToken)
        .status(200)
        .json({ accessToken: accessToken });
    } else return res.sendStatus(401);
  }

  async logOut(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const payload = await this.jwtService.getPayload(refreshToken);
    await this.deviceService.deleteOneDeviceById(payload.deviceId);

    return res.sendStatus(204);
  }
}
