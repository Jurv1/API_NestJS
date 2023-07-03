import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsLikesRepo: PostsLikesRepository,
    private readonly commentsLikesRepo: CommentsLikesRepository,
  ) {}

  async deleteOneCommentById(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteOne(id);
  }

  async deleteLikeDislikeForPost(
    userId: string,
    postId: string,
    userStatus: string,
  ) {
    return await this.postsLikesRepo.deleteLikeDislikeForPost(
      userId,
      postId,
      userStatus,
    );
  }

  async deleteLikeDislikeForComment(
    userId: string,
    commentId: string,
    userStatus: string,
  ) {
    return this.commentsLikesRepo.deleteLikeDislikeForComment(
      userId,
      commentId,
      userStatus,
    );
  }
}
