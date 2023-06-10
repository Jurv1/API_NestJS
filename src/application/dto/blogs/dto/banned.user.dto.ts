import { BanInfo } from '../../../schemas/users/schemas/ban.info.schema';

export class BannedUserDto {
  id: string;
  login: string;
  banInfo: BanInfo;
}
