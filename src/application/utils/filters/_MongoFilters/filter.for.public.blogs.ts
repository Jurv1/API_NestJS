import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../../schemas/blogs/schemas/blogs.database.schema';

export function filterForPublicBlogs(
  searchNameTerm: string | undefined,
): FilterQuery<BlogDocument> {
  const filter: FilterQuery<BlogDocument> = {};
  filter.$and = [];
  if (searchNameTerm) {
    filter.$and.push({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
  }

  filter.$and.push({ 'banInfo.isBanned': false });
  return filter;
}
