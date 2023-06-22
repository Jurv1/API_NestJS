import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CustomGuardForRefreshToken } from '../auth/guards/custom.guard.for.refresh.token';
import { CurrentRefreshToken } from '../auth/decorators/current-refresh-token';
import { Errors } from '../../../application/utils/handle.error';
import { GuardForSameUser } from '../auth/guards/guard.for.same-user';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteAllDevicesExceptActiveCommand } from './use-cases/command.use-cases/delete.all.devices.except.active.use-case';
import { DeleteOneDeviceCommand } from './use-cases/command.use-cases/delete.one.device.use-case';
import { GetAllDevicesQueryCommand } from './use-cases/query.use-cases/get.all.devices.use-case';

@Controller('security/devices')
export class PublicDeviceController {
  constructor(
    private readonly authService: AuthService,
    protected jwtService: JwtService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(CustomGuardForRefreshToken)
  @Get()
  async getAll(@CurrentRefreshToken() refresh) {
    const payload: any = await this.jwtService.decode(refresh);

    try {
      if (payload && payload.userId) {
        return await this.queryBus.execute(
          new GetAllDevicesQueryCommand(payload.userId, payload.deviceId),
        );
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(CustomGuardForRefreshToken)
  @HttpCode(204)
  @Delete()
  async deleteAllExceptActive(@CurrentRefreshToken() refresh) {
    try {
      const payload: any = await this.authService.verifyToken(refresh);
      const { userId, deviceId } = payload;
      if (userId && deviceId) {
        return await this.commandBus.execute(
          new DeleteAllDevicesExceptActiveCommand(userId, deviceId),
        );
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(CustomGuardForRefreshToken)
  @UseGuards(GuardForSameUser)
  @HttpCode(204)
  @Delete(':id')
  async deleteDeviceById(@Param('id') deviceId: string) {
    return await this.commandBus.execute(new DeleteOneDeviceCommand(deviceId));
  }
}
