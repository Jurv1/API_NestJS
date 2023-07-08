import { EnumForUserByAdminSorting } from '../../enums/enum.for.user.by.admin.sorting';

export function sortingForUsersByAdmin(
  sortBy: string,
  sortDirection: string,
): { [key: string]: string } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'createdAt';
  }
  if (!(sortBy in EnumForUserByAdminSorting)) sortBy = 'createdAt';
  const sort: { [key: string]: string } = { [`${sortBy}`]: 'desc' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'asc';
  }

  return sort;
}
