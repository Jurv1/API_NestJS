import { DevicesRepository } from '../../../application/infrastructure/devices/devices.repository';
import { DevicesQueryRepository } from '../../../application/infrastructure/devices/devices.query.repository';

export const allReposForDevices = [DevicesQueryRepository, DevicesRepository];
