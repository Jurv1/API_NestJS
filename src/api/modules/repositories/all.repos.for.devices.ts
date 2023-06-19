import { DeviceQ } from '../../../application/infrastructure/devices/_MongoDB/devices.query.repository';
import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';

export const allReposForDevices = [DeviceQ, DevicesRepository];
