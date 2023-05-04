import { Injectable } from '@nestjs/common';
import { CommentQ } from '../comments/comments.query.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/posts.database.schema';
import { Model, SortOrder } from 'mongoose';
import {
  CommentDocument,
  DBComment,
} from '../comments/schemas/comments.database.schema';

@Injectable()
export class PostQ {
  constructor(
    protected commentQ: CommentQ,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(DBComment.name) private commentModel: Model<CommentDocument>,
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
      items: allPosts.map((el) => [
        {
          id: el._id.toString(),
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId,
          blogName: el.blogName,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [
              {
                addedAt: '2023-05-02T20:33:06.537Z',
                userId: 'string',
                login: 'string',
              },
            ],
          },
          createdAt: el.createdAt,
        },
      ]),
    };
  }

  async getOnePost(id: string): Promise<any | null> {
    const result = await this.postModel.findOne({ _id: id });

    return {
      id: result.id.toString(),
      title: result.title,
      shortDescription: result.shortDescription,
      content: result.content,
      blogId: result.blogId,
      blogName: result.blogName,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          {
            addedAt: '2023-05-02T20:33:06.537Z',
            userId: 'string',
            login: 'string',
          },
        ],
      },
      createdAt: result.createdAt,
    };
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
      items: allPosts.map((el) => [
        {
          id: el._id.toString(),
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId,
          blogName: el.blogName,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [
              {
                addedAt: '2023-05-02T20:33:06.537Z',
                userId: 'string',
                login: 'string',
              },
            ],
          },
          createdAt: el.createdAt,
        },
      ]),
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
      items: allComments.map((el) => [
        {
          content: el.content,
          commentatorInfo: {
            userId: 'string',
            userLogin: 'string',
          },
          likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
          },
          postId: el.postId,
          createdAt: el.createdAt,
        },
      ]),
    };
  }
}
