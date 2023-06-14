import { SortOrder } from 'mongoose';

export class QueryForBannedUsers {
  searchLoginTerm: string;
  sortBy: string;
  sortDirection: SortOrder;
  pageNumber: string;
  pageSize: string;
}
