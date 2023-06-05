import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { DeviceQ } from '../../../devices/devices.query.repository';
import { JwtService } from '@nestjs/jwt';
import { CustomGuardForRefreshToken } from '../auth/guards/custom.guard.for.refresh.token';
import { CurrentRefreshToken } from '../auth/decorators/current-refresh-token';
import { DeviceDocument } from '../../../devices/schemas/devices.database.schema';
import { Errors } from '../../../utils/handle.error';
import { GuardForSameUser } from '../auth/guards/guard.for.same-user';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDevicesExceptActiveCommand } from './use-cases/delete.all.devices.except.active.use-case';
import { DeleteOneDeviceCommand } from './use-cases/delete.one.device.use-case';

@Controller('security/devices')
export class PublicDeviceController {
  constructor(
    private readonly authService: AuthService,
    private readonly deviceQ: DeviceQ,
    protected jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(CustomGuardForRefreshToken)
  @Get()
  async getAll(@CurrentRefreshToken() refresh) {
    const payload: any = await this.jwtService.decode(refresh);

    try {
      if (payload && payload.userId) {
        const allDevices = await this.deviceQ.getAllDevicesByUserId(
          payload.userId,
        );
        const device: DeviceDocument = await this.deviceQ.getOneDeviceById(
          payload.deviceId,
        );
        await device.updateLastActiveDate(new Date().getTime());
        await device.save();

        if (allDevices) {
          return allDevices.map((el) => {
            return {
              ip: el.ip,
              title: el.title,
              lastActiveDate: el.lastActiveDate,
              deviceId: el.deviceId,
            };
          });
        }
      }
      throw new Errors.NOT_FOUND();
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
