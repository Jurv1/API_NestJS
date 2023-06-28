import { enumType } from '../../enums/enum.types';
import { EnumForBlogs } from '../../enums/emun.for.blogs';
import { EnumForPosts } from '../../enums/enum.for.posts';
import { EnumForUserByAdminSorting } from '../../enums/enum.for.user.by.admin.sorting';

export function ultimateSort(
  sortBy: string,
  sortDirection: string,
  enumToCheck: enumType,
): { [key: string]: string } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'CreatedAt';
  } else {
    sortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
  }
  if (!Object.values(enumToCheck).includes(sortBy)) sortBy = 'CreatedAt';
  const sort: { [key: string]: string } = { [`${sortBy}`]: 'desc' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'asc';
  }
  return sort;
}
