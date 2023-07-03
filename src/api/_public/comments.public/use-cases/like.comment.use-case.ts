import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostQ } from '../../../../application/infrastructure/posts/_Mongo/posts.query.repository';
import { CommentQ } from '../../../../application/infrastructure/comments/_Mongo/comments.query.repository';
import { LikesRepository } from '../../../../application/infrastructure/likes/_Mongo/likes.repository';
import { CommentDocument } from '../../../../application/schemas/comments/schemas/comments.database.schema';
import { PostDocument } from '../../../../application/schemas/posts/schemas/posts.database.schema';
import { Errors } from '../../../../application/utils/handle.error';
import { PostsQueryRepository } from '../../../../application/infrastructure/posts/posts.query.repository';
import { CommentsQueryRepository } from '../../../../application/infrastructure/comments/comments.query.repository';
import { CommentsLikesRepository } from '../../../../application/infrastructure/likes/comments.likes.repository';

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
    private readonly postQ: PostsQueryRepository,
    private readonly commentQ: CommentsQueryRepository,
    private readonly likesRepo: CommentsLikesRepository,
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
