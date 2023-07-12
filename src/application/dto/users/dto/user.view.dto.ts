import { BanInfo } from '../../../schemas/users/schemas/ban.info.schema';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo | null;
}
