import { DevicesViewDto } from '../../dto/devices/dto/devices.view.dto';

export class DeviceMapper {
  mapDevices(objs: any[]): DevicesViewDto[] {
    return objs.map((el) => {
      return {
        ip: el.ip,
        title: el.title,
        lastActiveDate: el.lastActiveDate,
        deviceId: el.deviceId,
      };
    });
  }
}
