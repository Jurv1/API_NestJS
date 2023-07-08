import { enumType } from '../../enums/enum.types';

export function ultimateSort(
  sortBy: string,
  sortDirection: string,
  enumToCheck: enumType,
): { [key: string]: string } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'createdAt';
  }
  if (!Object.values(enumToCheck).includes(sortBy)) sortBy = 'createdAt';
  const sort: { [key: string]: string } = { [`${sortBy}`]: 'desc' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'asc';
  }
  return sort;
}
