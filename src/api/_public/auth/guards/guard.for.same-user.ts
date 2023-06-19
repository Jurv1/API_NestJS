import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Errors } from '../../../../application/utils/handle.error';
import { UsersQueryRepository } from '../../../../application/infrastructure/users/users.query.repository';
import { DevicesQueryRepository } from '../../../../application/infrastructure/devices/devices.query.repository';

@Injectable()
export class GuardForSameUser implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userQ: UsersQueryRepository,
    private readonly deviceQ: DevicesQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken: string = request.cookies.refreshToken;
    if (!refreshToken) throw new Errors.UNAUTHORIZED();
    const tokenPayload: any = await this.authService.getTokenPayload(
      refreshToken,
    );
    const user: any = await this.userQ.getOneUserById(tokenPayload.userId);
    if (user.length === 0) throw new Errors.FORBIDDEN();
    const device: any = await this.deviceQ.getOneDeviceById(request.params.id);
    if (device.length === 0) throw new Errors.NOT_FOUND();
    if (device[0].UserId !== user.id) throw new Errors.FORBIDDEN();
    return true;
  }
}
