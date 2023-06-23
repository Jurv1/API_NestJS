import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Errors } from '../../../../application/utils/handle.error';
import { AuthService } from '../auth.service';
import { DevicesQueryRepository } from '../../../../application/infrastructure/devices/devices.query.repository';
import { UsersQueryRepository } from '../../../../application/infrastructure/users/users.query.repository';

@Injectable()
export class CustomGuardForRefreshToken implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userQ: UsersQueryRepository,
    private readonly deviceQ: DevicesQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const refreshToken: string = request.cookies.refreshToken;
      if (!refreshToken) throw new Errors.UNAUTHORIZED();
      await this.authService.verifyToken(refreshToken);
      const tokenPayload: any = await this.authService.getTokenPayload(
        refreshToken,
      );
      if (!tokenPayload) throw new Errors.UNAUTHORIZED();
      const user: any = await this.userQ.getOneUserById(tokenPayload.userId);
      if (user.length === 0) throw new Errors.UNAUTHORIZED();
      const activeDevice = await this.deviceQ.getOneDeviceById(
        tokenPayload.deviceId,
      );
      if (activeDevice.length === 0) {
        throw new Errors.UNAUTHORIZED();
      }
      if (
        tokenPayload.iat * 1000 <
        new Date(activeDevice[0].LastActiveDate).getTime()
      ) {
        throw new Errors.UNAUTHORIZED();
      }
      return true;
    } catch (err) {
      console.log(err);
      throw new Errors.UNAUTHORIZED();
    }
  }
}
