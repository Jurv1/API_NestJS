import { CommentatorInfo } from '../../../schemas/comments/schemas/commentator.info.schema';

export class CommentsViewForBloggerDto {
  content: string;
  commentatorInfo: CommentatorInfo;
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
  createdAt: string;
}
