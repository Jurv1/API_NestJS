import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../../schemas/blogs/schemas/blogs.database.schema';

export function filterForBannedUsers(
  searchLoginTerm: string | undefined,
  bannedIds: string[],
) {
  const filter: FilterQuery<BlogDocument> = {};
  filter.$and = [];
  if (searchLoginTerm) {
    filter.$and.push({
      'accountData.login': {
        $regex: searchLoginTerm,
        $options: 'i',
      },
    });
  }

  filter.$and.push({ _id: { $in: bannedIds } });
  return filter;
}
