import { EnumForBlogs } from '../../enums/emun.for.blogs';

export function sortingForBlogs(
  sortBy: string,
  sortDirection: string,
): { [key: string]: 'ASC' | 'DESC' } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'CreatedAt';
  } else {
    sortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
  }
  if (!(sortBy in EnumForBlogs)) sortBy = 'CreatedAt';
  const sort: { [key: string]: 'ASC' | 'DESC' } = { [`${sortBy}`]: 'DESC' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'ASC';
  }

  return sort;
}
