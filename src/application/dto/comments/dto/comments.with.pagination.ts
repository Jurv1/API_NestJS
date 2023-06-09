import { CommentDocument } from '../../../schemas/comments/schemas/comments.database.schema';
import { CommentsViewForBloggerDto } from './comments.view.for.blogger.dto';

export class CommentsWithPagination {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentDocument[] | CommentsViewForBloggerDto[];
}
