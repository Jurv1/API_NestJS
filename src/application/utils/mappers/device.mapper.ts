import { DevicesViewDto } from '../../dto/devices/dto/devices.view.dto';

export class DeviceMapper {
  mapDevices(objs: any[]): DevicesViewDto[] {
    return objs.map((el) => {
      return {
        ip: el.Ip,
        title: el.Title,
        lastActiveDate: el.LastActiveDate,
        deviceId: el.DeviceId,
      };
    });
  }
}
