import { SortOrder } from 'mongoose';

export function queryValidator(
  sortBy: string,
  sortDirection: any,
): { [key: string]: SortOrder } {
  typeof sortBy === 'undefined' ? (sortBy = 'createdAt') : sortBy;
  const sort: { [key: string]: SortOrder } = { [sortBy]: 'desc' };

  if (sortDirection === 'asc') {
    sort[sortBy] = 'asc';
  }

  return sort;
}
