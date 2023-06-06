import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';

export function filterForBlogger(
  searchNameTerm: string | undefined,
  userId: string,
): FilterQuery<BlogDocument> {
  const filter: FilterQuery<BlogDocument> = {};
  filter.$and = [];

  if (searchNameTerm) {
    filter.$and.push({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
  }

  filter.$and.push({ 'ownerInfo.userId': userId });

  return filter;
}
