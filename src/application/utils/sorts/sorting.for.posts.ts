import { EnumForBlogs } from '../../enums/emun.for.blogs';
import { EnumForPosts } from '../../enums/enum.for.posts';

export function sortingForPosts(
  sortBy: string,
  sortDirection: string,
): { [key: string]: string } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'CreatedAt';
  } else {
    sortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
  }
  if (!(sortBy in EnumForPosts)) sortBy = 'CreatedAt';
  const sort: { [key: string]: string } = { [`${sortBy}`]: 'desc' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'asc';
  }

  return sort;
}
