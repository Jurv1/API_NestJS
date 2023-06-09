import { Injectable } from '@nestjs/common';
import { PostUpdateBody } from '../../dto/posts/dto/post.update.body';
import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { Errors } from '../../utils/handle.error';
import { CommentCreatingDto } from '../../dto/comments/dto/comment.creating.dto';
import { UserIdAndLogin } from '../../../api/_public/auth/dto/user-id.and.login';
import { PostCreationDto } from '../../dto/posts/dto/post.creation.dto';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { Post } from '../../entities/posts/post.entity';
import { Comment } from '../../entities/comments/comment.entity';
import { Blog } from '../../entities/blogs/blog.entity';

@Injectable()
export class PostService {
  constructor(
    protected readonly blogQ: BlogsQueryRepository,
    protected readonly postsRepository: PostsRepository,
    protected readonly postQ: PostsQueryRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}
  async createOnePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    userData: UserIdAndLogin,
  ): Promise<Post[] | null> {
    const foundedEl: Blog[] = await this.blogQ.getOneBlog(blogId);

    if (foundedEl.length > 0) {
      const blogName: string = foundedEl[0].name;
      const postDto: PostCreationDto = {
        title: title,
        shortDescription: shortDescription,
        content: content,
        ownerInfo: {
          userId: userData.userId,
          userLogin: userData.userLogin,
        },
        blogId: blogId,
        blogName: blogName,
      };
      return await this.postsRepository.createOne(postDto);
    } else {
      throw new Errors.BAD_REQUEST({
        errorsMessages: [
          {
            message: 'No such blog',
            field: 'blogId',
          },
        ],
      });
    }
  }

  async updateOnePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const postUpdateBody: PostUpdateBody = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    return await this.postsRepository.updatePost(id, postUpdateBody);
  }

  async deleteOnePost(id: string): Promise<boolean> {
    return await this.postsRepository.deleteOne(id);
  }

  async createOneCommentByPostId(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ): Promise<Comment[] | null> {
    const foundedEl: any = await this.postQ.getOnePost(postId);
    if (foundedEl.length !== 0) {
      const newCommentTmp: CommentCreatingDto = {
        content: content,
        commentatorInfo: {
          userId: userId.toString(),
          userLogin: userLogin,
        },
        postInfo: {
          id: postId,
          title: foundedEl[0].Title,
          blogName: foundedEl[0].BlogName,
          blogId: foundedEl[0].BlogId.toString(),
          blogOwnerId: foundedEl[0].OwnerId.toString(),
        },
      };
      return await this.commentsRepository.createComment(newCommentTmp);
    } else return null;
  }
}
