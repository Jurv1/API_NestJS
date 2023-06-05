import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostQ } from '../../../../posts/posts.query.repository';
import { CommentQ } from '../../../../comments/comments.query.repository';
import { LikesRepository } from '../../../../likes/likes.repository';
import { CommentDocument } from '../../../../comments/schemas/comments.database.schema';
import { PostDocument } from '../../../../posts/schemas/posts.database.schema';
import { Errors } from '../../../../utils/handle.error';

export class LikeCommentOrPostCommand {
  constructor(
    public commentOrPostId: string,
    public likeStatus: string,
    public userId: string,
    public userLogin: string,
    public commentOrPost: string,
  ) {}
}

@CommandHandler(LikeCommentOrPostCommand)
export class LikeCommentOrPostUseCase
  implements ICommandHandler<LikeCommentOrPostCommand>
{
  constructor(
    private readonly postQ: PostQ,
    private readonly commentQ: CommentQ,
    private readonly likesRepo: LikesRepository,
  ) {}
  async execute(command: LikeCommentOrPostCommand) {
    let commentOrPost: CommentDocument | PostDocument;
    if (!command.commentOrPostId) throw new Errors.NOT_FOUND();
    if (command.commentOrPost === 'post') {
      commentOrPost = await this.postQ.getOnePost(command.commentOrPostId);
    } else {
      commentOrPost = await this.commentQ.getOneComment(
        command.commentOrPostId,
      );
    }
    if (!commentOrPost) throw new Errors.NOT_FOUND();
    ////////////////
    const userStatus = await this.likesRepo.getUserStatusForCommentOrPost(
      command.userId,
      command.commentOrPostId,
    );
    if (command.likeStatus === 'None') {
      const result: boolean = await this.likesRepo.deleteLikeDislike(
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
        await this.likesRepo.deleteLikeDislike(
          command.userId,
          command.commentOrPostId,
          userStatus.userStatus,
        );
        return;
      } else if (userStatus?.userStatus === 'Like') {
        return;
      } else {
        const result = await this.likesRepo.likePostOrComment(
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
        await this.likesRepo.deleteLikeDislike(
          command.userId,
          command.commentOrPostId,
          userStatus.userStatus,
        );
        const result = await this.likesRepo.likePostOrComment(
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
        const result = await this.likesRepo.likePostOrComment(
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
