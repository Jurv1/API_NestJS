import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../../../application/infrastructure/posts/posts.query.repository';
import { PostsLikesRepository } from '../../../../../application/infrastructure/likes/posts.likes.repository';
import { errorIfNan } from '../../../../../application/utils/funcs/is.Nan';
import { Errors } from '../../../../../application/utils/handle.error';

export class LikePostCommand {
  constructor(
    public commentOrPostId: string,
    public likeStatus: string,
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private readonly postQ: PostsQueryRepository,
    private readonly likesRepo: PostsLikesRepository,
  ) {}
  async execute(command: LikePostCommand) {
    errorIfNan(command.commentOrPostId);
    const post: any = await this.postQ.getOnePost(command.commentOrPostId);
    if (post.length === 0) throw new Errors.NOT_FOUND();
    const userStatus = await this.likesRepo.getUserStatusForPost(
      command.userId,
      command.commentOrPostId,
    );
    if (command.likeStatus === 'None') {
      const result: boolean = await this.likesRepo.deleteLikeDislikeForPost(
        command.userId,
        command.commentOrPostId,
        userStatus[0].LikeStatus,
      );
      if (result) {
        return;
      }
      throw new Errors.NOT_FOUND();
    }
    if (command.likeStatus === 'Like') {
      if (userStatus[0]?.LikeStatus === 'Dislike') {
        //remove dislike and create like
        await this.likesRepo.deleteLikeDislikeForPost(
          command.userId,
          command.commentOrPostId,
          userStatus[0]?.LikeStatus,
        );
        return;
      } else if (userStatus[0]?.LikeStatus === 'Like') {
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
      if (userStatus[0]?.LikeStatus === 'Like') {
        await this.likesRepo.deleteLikeDislikeForPost(
          command.userId,
          command.commentOrPostId,
          userStatus[0]?.LikeStatus,
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
      } else if (userStatus[0]?.LikeStatus === 'Dislike') {
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
