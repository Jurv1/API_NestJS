import { DeleteAllDevicesExceptActiveUseCase } from '../../_public/devices.public/use-cases/delete.all.devices.except.active.use-case';
import { DeleteOneDeviceUseCase } from '../../_public/devices.public/use-cases/delete.one.device.use-case';

export const allDevicesUseCases = [
  DeleteAllDevicesExceptActiveUseCase,
  DeleteOneDeviceUseCase,
];
