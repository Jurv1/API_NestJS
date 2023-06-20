import { EnumForUserByAdminSorting } from '../../enums/enum.for.user.by.admin.sorting';

export function sortingForUsersByAdmin(
  sortBy: string,
  sortDirection: string,
): { [key: string]: string } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'CreatedAt';
  } else {
    sortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
  }
  if (!(sortBy in EnumForUserByAdminSorting)) sortBy = 'CreatedAt';
  const sort: { [key: string]: string } = { [`${sortBy}`]: 'desc' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'asc';
  }

  return sort;
}
