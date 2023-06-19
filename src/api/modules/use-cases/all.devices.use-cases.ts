import { DeleteAllDevicesExceptActiveUseCase } from '../../_public/devices.public/use-cases/command.use-cases/delete.all.devices.except.active.use-case';
import { DeleteOneDeviceUseCase } from '../../_public/devices.public/use-cases/command.use-cases/delete.one.device.use-case';
import { GetAllDevicesUseCase } from '../../_public/devices.public/use-cases/query.use-cases/get.all.devices.use-case';

export const allDevicesUseCases = [
  GetAllDevicesUseCase,
  DeleteAllDevicesExceptActiveUseCase,
  DeleteOneDeviceUseCase,
];
