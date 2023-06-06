import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Errors } from '../../../../application/utils/handle.error';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserQ } from '../../../../application/infrastructure/users/users.query.repository';
import { UserDocument } from '../../../../application/schemas/users/schemas/users.database.schema';
import { DeviceQ } from '../../../../application/infrastructure/devices/devices.query.repository';

@Injectable()
export class CustomGuardForRefreshToken implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userQ: UserQ,
    private readonly deviceQ: DeviceQ,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const refreshToken: string = request.cookies.refreshToken;
      if (!refreshToken) throw new Errors.UNAUTHORIZED();
      await this.authService.verifyToken(refreshToken);
      const isBlackedListed = await this.authService.isRefreshInBlackList(
        refreshToken,
      );
      if (isBlackedListed) throw new Errors.UNAUTHORIZED();
      const tokenPayload: any = await this.authService.getTokenPayload(
        refreshToken,
      );
      if (!tokenPayload) throw new Errors.UNAUTHORIZED();
      const user: UserDocument = await this.userQ.getOneUserById(
        tokenPayload.userId,
      );
      if (!user) throw new Errors.UNAUTHORIZED();
      const activeDevice = await this.deviceQ.getOneDeviceById(
        tokenPayload.deviceId,
      );
      if (!activeDevice) return false;
      return true;
    } catch (err) {
      console.log(err);
      throw new Errors.UNAUTHORIZED();
    }
  }
}
