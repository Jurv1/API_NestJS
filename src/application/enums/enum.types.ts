import { EnumForPosts } from './enum.for.posts';
import { EnumForBlogs } from './emun.for.blogs';
import { EnumForUserByAdminSorting } from './enum.for.user.by.admin.sorting';
import { EnumForComments } from './enum.for.comments';

export type enumType =
  | typeof EnumForBlogs
  | typeof EnumForPosts
  | typeof EnumForUserByAdminSorting
  | typeof EnumForComments;
