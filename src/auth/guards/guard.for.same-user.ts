import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserQ } from '../../users/users.query.repository';
import { DeviceQ } from '../../devices/devices.query.repository';
import { UserDocument } from '../../users/schemas/users.database.schema';
import { Errors } from '../../utils/handle.error';
import { DeviceDocument } from '../../devices/schemas/devices.database.schema';

@Injectable()
export class GuardForSameUser implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userQ: UserQ,
    private readonly deviceQ: DeviceQ,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken: string = request.cookies.refreshToken;
    const tokenPayload = await this.authService.getUserIdByToken(refreshToken);
    const user: UserDocument = await this.userQ.getOneUserById(
      tokenPayload.userId,
    );
    if (!user) throw new Errors.FORBIDDEN();
    const device: DeviceDocument =
      await this.deviceQ.getOneDeviceByUserIdAndDeviceId(
        user._id.toString(),
        tokenPayload.deviceId,
      );
    if (!device) throw new Errors.FORBIDDEN();
    return true;
  }
}
