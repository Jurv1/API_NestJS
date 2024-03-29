import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Errors } from '../../../../application/utils/handle.error';
import { AuthService } from '../auth.service';
import { DevicesQueryRepository } from '../../../../application/infrastructure/devices/devices.query.repository';
import { UsersQueryRepository } from '../../../../application/infrastructure/users/users.query.repository';
import { Device } from '../../../../application/entities/devices/device.entity';
import { User } from '../../../../application/entities/users/user.entity';

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
      const user: User = await this.userQ.getOneUserById(tokenPayload.userId);
      if (!user) throw new Errors.UNAUTHORIZED();
      const activeDevice: Device = await this.deviceQ.getOneDeviceById(
        tokenPayload.deviceId,
      );
      if (!activeDevice) {
        throw new Errors.UNAUTHORIZED();
      }
      if (
        new Date(tokenPayload.iat * 1000).toISOString() <
        activeDevice.LastActiveDate.toISOString()
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
