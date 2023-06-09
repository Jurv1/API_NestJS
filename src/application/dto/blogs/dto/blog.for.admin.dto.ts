import { OwnerInfoDto } from './owner.info.dto';
import { BlogBanInfoDto } from './blog.ban.info.dto';

export class BlogForAdminDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
  blogOwnerInfo: OwnerInfoDto;
  banInfo: BlogBanInfoDto;
}
