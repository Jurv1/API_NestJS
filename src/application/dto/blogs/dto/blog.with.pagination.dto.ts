import { BlogDocument } from '../../../schemas/blogs/schemas/blogs.database.schema';
import { BlogForAdminDto } from './blog.for.admin.dto';
import { BlogViewDto } from './blog.view.dto';

export class BlogWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogDocument[] | BlogForAdminDto[] | BlogViewDto[];
}
