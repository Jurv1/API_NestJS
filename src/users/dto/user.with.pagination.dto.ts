import { UserDocument } from '../schemas/users.database.schema';
import { UserViewDto } from './user.view.dto';

export class UserWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserDocument[] | UserViewDto[];
}
