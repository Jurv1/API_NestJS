import { EnumForUserByAdminSorting } from '../../enums/enum.for.user.by.admin.sorting';

export function sortingForUsersByAdmin(
  sortBy: string,
  sortDirection: string,
): { [key: string]: 'ASC' | 'DESC' } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'createdAt';
  }
  if (!(sortBy in EnumForUserByAdminSorting)) sortBy = 'createdAt';
  const sort: { [key: string]: 'ASC' | 'DESC' } = { [`${sortBy}`]: 'DESC' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'ASC';
  }

  return sort;
}
