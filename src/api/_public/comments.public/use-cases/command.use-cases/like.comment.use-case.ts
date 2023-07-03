import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Errors } from '../../../../../application/utils/handle.error';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { CommentsQueryRepository } from '../../../../../application/infrastructure/comments/comments.query.repository';
import { CommentsLikesRepository } from '../../../../../application/infrastructure/likes/comments.likes.repository';

export class LikeCommentCommand {
  constructor(
    public commentOrPostId: string,
    public likeStatus: string,
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentUseCase implements ICommandHandler<LikeCommentCommand> {
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly commentQ: CommentsQueryRepository,
    private readonly likesRepo: CommentsLikesRepository,
  ) {}
  async execute(command: LikeCommentCommand) {
    if (!command.commentOrPostId) throw new Errors.NOT_FOUND();
    const commentOrPost = await this.commentQ.getOneComment(
      command.commentOrPostId,
    );
    if (!commentOrPost) throw new Errors.NOT_FOUND();
    ////////////////
    const userStatus = await this.likesRepo.getUserStatusForComment(
      command.userId,
      command.commentOrPostId,
    );
    if (command.likeStatus === 'None') {
      const result: boolean = await this.likesRepo.deleteLikeDislikeForComment(
        command.userId,
        command.commentOrPostId,
        userStatus?.userStatus,
      );
      if (result) {
        return;
      }
      throw new Errors.NOT_FOUND();
    }
    if (command.likeStatus === 'Like') {
      if (userStatus?.userStatus === 'Dislike') {
        //remove dislike and create like
        await this.likesRepo.deleteLikeDislikeForComment(
          command.userId,
          command.commentOrPostId,
          userStatus.userStatus,
        );
        return;
      } else if (userStatus?.userStatus === 'Like') {
        return;
      } else {
        const result = await this.likesRepo.likeComment(
          command.commentOrPostId,
          command.likeStatus,
          command.userId,
          command.userLogin,
        );
        if (result) {
          return;
        }
        throw new Errors.NOT_FOUND();
      }
    }
    if (command.likeStatus === 'Dislike') {
      if (userStatus?.userStatus === 'Like') {
        await this.likesRepo.deleteLikeDislikeForComment(
          command.userId,
          command.commentOrPostId,
          userStatus.userStatus,
        );
        const result = await this.likesRepo.likeComment(
          command.commentOrPostId,
          command.likeStatus,
          command.userId,
          command.userLogin,
        );
        if (result) {
          return;
        }
        throw new Errors.NOT_FOUND();
        //remove like and create dislike
      } else if (userStatus?.userStatus === 'Dislike') {
        return;
      } else {
        //create Dislike
        const result = await this.likesRepo.likeComment(
          command.commentOrPostId,
          command.likeStatus,
          command.userId,
          command.userLogin,
        );
        if (result) {
          return;
        }
        throw new Errors.NOT_FOUND();
      }
    }
  }
}
