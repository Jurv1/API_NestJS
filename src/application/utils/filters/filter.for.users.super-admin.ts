import { FilterQuery } from 'mongoose';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';

export function filterForUsersSuperAdmin(
  banStatus: string,
  searchLoginTerm: string | undefined,
  searchEmailTerm: string | undefined,
): FilterQuery<UserDocument> {
  const filter: FilterQuery<UserDocument> = {};
  if (banStatus) {
    filter.$and = [];
    if (banStatus === 'banned') filter.$and.push({ 'banInfo.isBanned': true });
    if (banStatus === 'notBanned')
      filter.$and.push({ 'banInfo.isBanned': false });
  }

  if (searchLoginTerm || searchEmailTerm) {
    filter.$or = [];

    if (searchLoginTerm) {
      filter.$or.push({
        'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      filter.$or.push({
        'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
      });
    }
  }

  return filter;
}
