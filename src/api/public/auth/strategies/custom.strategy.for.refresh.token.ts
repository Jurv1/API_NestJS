import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import process from 'process';
import { cookieGetter } from '../../../../application/utils/cookie.getter';

export class CustomStrategyForRefreshToken extends PassportStrategy(
  Strategy,
  'custom',
) {
  constructor() {
    super({
      jwtFromRequest: cookieGetter,
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(refreshToken: any) {
    return true;
  }
}
