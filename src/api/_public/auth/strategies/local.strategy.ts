import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Errors } from '../../../../application/utils/handle.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Errors.UNAUTHORIZED();
    }
    if (user.isBanned) throw new Errors.UNAUTHORIZED();
    if (!user.isConfirmed) throw new Errors.UNAUTHORIZED();
    return user;
  }
}
