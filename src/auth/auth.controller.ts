import {
  Controller,
  Post,
  UseGuards,
  Response,
  Get,
  HttpCode,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQ: UserQ,
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
}
