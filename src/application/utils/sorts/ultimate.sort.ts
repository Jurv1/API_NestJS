import { enumType } from '../../enums/enum.types';

export function ultimateSort(
  sortBy: string,
  sortDirection: string,
  enumToCheck: enumType,
): { [key: string]: 'ASC' | 'DESC' } {
  if (typeof sortBy === 'undefined') {
    sortBy = 'createdAt';
  }
  if (!Object.values(enumToCheck).includes(sortBy)) sortBy = 'createdAt';
  const sort: { [key: string]: 'ASC' | 'DESC' } = { [`${sortBy}`]: 'DESC' };

  if (sortDirection === 'asc') {
    sort[`${sortBy}`] = 'ASC';
  }
  return sort;
}
