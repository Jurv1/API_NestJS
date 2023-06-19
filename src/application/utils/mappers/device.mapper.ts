export class DeviceMapper {
  mapDevices(objs: any[]) {
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
