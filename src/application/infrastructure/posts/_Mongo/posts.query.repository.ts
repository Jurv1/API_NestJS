import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../../schemas/posts/schemas/posts.database.schema';
import { Model, SortOrder } from 'mongoose';
import {
  CommentDocument,
  DBComment,
} from '../../../schemas/comments/schemas/comments.database.schema';
import { PostMapper } from '../../../utils/mappers/post.mapper';
import { CommentMapper } from '../../../utils/mappers/comment.mapper';
import { PostsLikesRepository } from '../../likes/posts.likes.repository';

@Injectable()
export class PostQ {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
    private readonly likesRepo: PostsLikesRepository,
    private readonly postMapper: PostMapper,
    private readonly commentMapper: CommentMapper,
  ) {}
  async getAllPosts(
    filter: Document,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId?: string,
  ): Promise<any> {
    const allPosts = await this.postModel
      .find(filter)
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();

    const countDocs = await this.postModel.countDocuments(filter);
    const pagesCount = Math.ceil(countDocs / pagination['pageSize']);

    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDocs,
      items: await this.postMapper.mapPosts(allPosts, userId),
    };
  }

  async getOnePost(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({
      $and: [{ _id: id }, { isUserBanned: false }],
    });
  }
  async getOnePostByPostAndBlogIds(
    postId: string,
    blogId: string,
  ): Promise<PostDocument | null> {
    return this.postModel.findOne({
      $and: [{ _id: postId }, { blogId: blogId }, { isUserBanned: false }],
    });
  }
  async getAllPostsByBlogId(
    id: string,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId?: string,
  ): Promise<any> {
    const countDoc: number = await this.postModel.countDocuments({
      blogId: id,
    });
    const pagesCount: number = Math.ceil(countDoc / pagination['pageSize']);
    const allPosts = await this.postModel
      .find({ $and: [{ blogId: id }, { isUserBanned: false }] })
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();
    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDoc,
      items: await this.postMapper.mapPosts(allPosts, userId),
    };
  }

  async getAllCommentsByPostId(
    postId: string,
    sort: { [key: string]: SortOrder },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId?: string,
  ): Promise<any> {
    const countDoc = await this.commentModel.countDocuments({ postId: postId });
    const pagesCount = Math.ceil(countDoc / pagination['pageSize']);
    const allComments = await this.commentModel
      .find({ $and: [{ postId: postId }, { isUserBanned: false }] })
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();
    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDoc,
      items: await this.commentMapper.mapComments(allComments, userId),
    };
  }
}
