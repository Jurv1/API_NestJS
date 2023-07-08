import { DevicesViewDto } from '../../dto/devices/dto/devices.view.dto';
import { Device } from '../../entities/devices/device.entity';

export class DeviceMapper {
  mapDevices(objs: Device[]): DevicesViewDto[] {
    return objs.map((el) => {
      return {
        ip: el.ip,
        title: el.title,
        lastActiveDate: el.LastActiveDate,
        deviceId: el.deviceId,
      };
    });
  }
}
