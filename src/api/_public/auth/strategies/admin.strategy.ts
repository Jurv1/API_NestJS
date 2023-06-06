import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string) {
    if ('admin' === username && 'qwerty' === password) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
