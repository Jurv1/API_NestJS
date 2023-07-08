import { BanInfo } from '../../../schemas/users/schemas/ban.info.schema';

export class UserViewBloggerDto {
  id: string;
  login: string;
  banInfo: BanInfo;
}
