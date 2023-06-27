import { BlogsRepository } from '../../../application/infrastructure/blogs/blogs.repository';
import { BlogsQueryRepository } from '../../../application/infrastructure/blogs/blogs.query.repository';
export const allReposForBlogs = [BlogsQueryRepository, BlogsRepository];
