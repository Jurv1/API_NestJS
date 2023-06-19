import { DevicesViewDto } from '../../dto/devices/dto/devices.view.dto';

export class DeviceMapper {
  mapDevices(objs: any[]): DevicesViewDto[] {
    return objs.map((el) => {
      return {
        ip: el[0].Ip,
        title: el[0].Title,
        lastActiveDate: el[0].LastActiveDate,
        deviceId: el[0].DeviceId,
      };
    });
  }
}
