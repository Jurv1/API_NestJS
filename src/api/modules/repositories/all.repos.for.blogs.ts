import { BlogQ } from '../../../application/infrastructure/blogs/_MongoDB/blogs.query.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/_MongoDB/blogs.repository';

export const allReposForBlogs = [BlogQ, BlogsRepository];
