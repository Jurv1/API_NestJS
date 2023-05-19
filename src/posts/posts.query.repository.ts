import { Injectable } from '@nestjs/common';
import { CommentQ } from '../comments/comments.query.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from './schemas/posts.database.schema';
import { Model, SortOrder } from 'mongoose';
import {
  CommentDocument,
  DBComment,
} from '../comments/schemas/comments.database.schema';
import { LikesRepository } from '../likes/likes.repository';
import { LikeDocument } from '../likes/schemas/like.database.schema';

@Injectable()
export class PostQ {
  constructor(
    protected commentQ: CommentQ,
    @InjectModel(Post.name) private postModel: PostModelType,
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
    private readonly likesRepo: LikesRepository,
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
      items: await Promise.all(
        allPosts.map(async (el) => {
          const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
            el._id.toString(),
          );
          const allDislikes =
            await this.likesRepo.countAllDislikesForPostOrComment(
              el._id.toString(),
            );
          let userStatus = 'None';
          if (userId) {
            const like: LikeDocument =
              await this.likesRepo.getUserStatusForComment(
                userId,
                el._id.toString(),
              );
            userStatus = like.userStatus;
          }

          const lastThreeLikes = await this.likesRepo.findLatestThreeLikes(
            el._id.toString(),
          );

          return {
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            extendedLikesInfo: {
              likesCount: allLikes,
              dislikesCount: allDislikes,
              myStatus: userStatus,
              newestLikes: await lastThreeLikes.map((like) => {
                return {
                  addedAt: like.addedAt,
                  userId: like.userId,
                  login: like.userLogin,
                };
              }),
            },
            createdAt: el.createdAt,
          };
        }),
      ),
    };
  }

  async getOnePost(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ _id: id });
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
      .find({ blogId: id })
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();
    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDoc,
      items: await Promise.all(
        allPosts.map(async (el) => {
          const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
            el._id.toString(),
          );
          const allDislikes =
            await this.likesRepo.countAllDislikesForPostOrComment(
              el._id.toString(),
            );
          let userStatus = 'None';
          if (userId) {
            const like: LikeDocument =
              await this.likesRepo.getUserStatusForComment(
                userId,
                el._id.toString(),
              );
            userStatus = like.userStatus;
          }

          const lastThreeLikes = await this.likesRepo.findLatestThreeLikes(
            el._id.toString(),
          );

          return {
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            extendedLikesInfo: {
              likesCount: allLikes,
              dislikesCount: allDislikes,
              myStatus: userStatus,
              newestLikes: lastThreeLikes.map((like) => {
                {
                  addedAt: like.addedAt;
                  userId: like.userId;
                  login: like.userLogin;
                }
              }),
            },
            createdAt: el.createdAt,
          };
        }),
      ),
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
      .find({ postId: postId })
      .sort(sort)
      .skip(pagination['skipValue'])
      .limit(pagination['limitValue'])
      .lean();
    return {
      pagesCount: pagesCount,
      page: pagination['pageNumber'],
      pageSize: pagination['pageSize'],
      totalCount: countDoc,
      items: await Promise.all(
        allComments.map(async (el) => {
          const allLikes = await this.likesRepo.countAllLikesForPostOrComment(
            el._id.toString(),
          );
          const allDislikes =
            await this.likesRepo.countAllDislikesForPostOrComment(
              el._id.toString(),
            );

          let userStatus = 'None';
          if (userId) {
            const like: LikeDocument =
              await this.likesRepo.getUserStatusForComment(
                userId,
                el._id.toString(),
              );
            userStatus = like.userStatus;
          }
          return {
            content: el.content,
            commentatorInfo: {
              userId: 'string',
              userLogin: 'string',
            },
            likesInfo: {
              likesCount: allLikes,
              dislikesCount: allDislikes,
              myStatus: userStatus,
            },
            postId: el.postId,
            createdAt: el.createdAt,
          };
        }),
      ),
    };
  }
}
