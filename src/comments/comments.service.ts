import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../likes/likes.repository';
import { CommentRepository } from './comments.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentsRepository: CommentRepository,
    private readonly likesRepo: LikesRepository,
  ) {}

  async deleteOneCommentById(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteOne(id);
  }

  async deleteLikeDislike(
    userId: string,
    commentId: string,
    userStatus: string,
  ) {
    return await this.likesRepo.deleteLikeDislike(
      userId,
      commentId,
      userStatus,
    );
  }
}
