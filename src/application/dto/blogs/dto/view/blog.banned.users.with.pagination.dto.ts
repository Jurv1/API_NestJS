import { BannedUserDto } from '../banned.user.dto';

export class BlogBannedUsersWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: any;
}
