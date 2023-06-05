import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DeviceQ } from './devices.query.repository';
import { DevicesService } from './devices.service';
import { JwtService } from '@nestjs/jwt';
import { CurrentRefreshToken } from '../api/public/auth/decorators/current-refresh-token';
import { Errors } from '../utils/handle.error';
import { CustomGuardForRefreshToken } from '../api/public/auth/guards/custom.guard.for.refresh.token';
import { GuardForSameUser } from '../api/public/auth/guards/guard.for.same-user';
import * as http from 'http';
import { DeviceDocument } from './schemas/devices.database.schema';
import { AuthService } from '../api/public/auth/auth.service';

@Controller('security/devices')
export class DeviceController {
  constructor(
    private readonly authService: AuthService,
    private readonly deviceQ: DeviceQ,
    protected deviceService: DevicesService,
    protected jwtService: JwtService,
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
        const isDeleted = await this.deviceService.deleteAllDevicesExceptActive(
          userId,
          deviceId,
        );
        if (isDeleted) return;
        throw new Errors.NOT_FOUND();
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
    try {
      const isDeleted = await this.deviceService.deleteOneDeviceById(deviceId);

      if (isDeleted) return;
      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
