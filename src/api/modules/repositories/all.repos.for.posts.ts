import { PostsRepository } from '../../../application/infrastructure/posts/posts.repository';
import { PostsQueryRepository } from '../../../application/infrastructure/posts/posts.query.repository';

export const allReposForPosts = [PostsQueryRepository, PostsRepository];
