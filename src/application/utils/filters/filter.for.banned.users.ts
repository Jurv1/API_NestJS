import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';

export function filterForBannedUsers(
  searchLoginTerm: string | undefined,
  blogId: string,
) {
  const filter: FilterQuery<BlogDocument> = {};
  filter.$and = [];
  if (searchLoginTerm) {
    filter.$and.push({
      'bannedUsersForBlog.login': {
        $regex: searchLoginTerm,
        $options: 'i',
      },
    });
  }

  filter.$and.push({ _id: blogId });
  return filter;
}
