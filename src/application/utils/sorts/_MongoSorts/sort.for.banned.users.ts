import { SortOrder } from 'mongoose';

export function sortForBannedUsers(sortBy: string, sortDirection: SortOrder) {
  if (typeof sortBy === 'undefined') {
    sortBy = 'createdAt';
  }
  const sortingObj: { [key: string]: SortOrder } = {
    [`accountData.${sortBy}`]: 'desc',
  };

  if (sortDirection === 'asc') {
    sortingObj[`accountData.${sortBy}`] = 'asc';
  }

  return sortingObj;
}
