import { BlogQ } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { BlogsRepository } from '../../../application/infrastructure/blogs/blogs.repository';

export const allReposForBlogs = [BlogQ, BlogsRepository];
