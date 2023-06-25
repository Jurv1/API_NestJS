import { BanInfo } from '../../../src/application/schemas/users/schemas/ban.info.schema';
import { validBanReason } from '../../constants/data-constants/users-data/ban.body.data';
export const unbannedUserBanInfo: BanInfo = {
  isBanned: false,
  banDate: null,
  banReason: null,
};
export const bannedUserBanInfo: BanInfo = {
  isBanned: true,
  banDate: expect.any(String),
  banReason: validBanReason,
};
