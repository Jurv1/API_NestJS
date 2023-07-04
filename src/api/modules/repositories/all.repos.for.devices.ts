import { DeviceQ } from '../../../application/infrastructure/devices/_MongoDB/devices.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { DevicesQueryRepository } from '../../../application/infrastructure/devices/devices.query.repository';

export const allReposForDevices = [DevicesQueryRepository, DevicesRepository];
