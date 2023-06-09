import { FilterQuery } from 'mongoose';
import { BlogDocument } from '../../../schemas/blogs/schemas/blogs.database.schema';

export function filterQueryValid(
  searchNameTerm?: string,
  searchLoginTerm?: string,
  searchEmailTerm?: string,
): FilterQuery<BlogDocument> {
  const filter: FilterQuery<BlogDocument> = {};
  console.log(searchNameTerm, searchLoginTerm, searchEmailTerm);
  typeof searchNameTerm === 'undefined'
    ? console.log('No Name Term')
    : (filter.name = { $regex: searchNameTerm, $options: 'i' });

  if (searchLoginTerm || searchEmailTerm) {
    filter.$or = [];
    typeof searchLoginTerm === 'undefined'
      ? console.log('No Login Term')
      : filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    typeof searchEmailTerm === 'undefined'
      ? console.log('No Email Term')
      : filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
  }
  filter.$and = [];
  filter.$and.push({ isUserBanned: false });
  return filter;
}
