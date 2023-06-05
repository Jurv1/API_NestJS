import { BanInfo } from '../schemas/ban.info.schema';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo;
}
