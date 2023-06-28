import { DataSource } from 'typeorm';
import { SortOrder } from 'mongoose';
import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { InjectDataSource } from '@nestjs/typeorm';

export class PostsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAllPosts(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId?: string,
  ): Promise<any> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."Posts"
      WHERE "UserStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
    );
  }

  async countAllPosts(): Promise<number> {
    const count = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."Posts";
      `,
    );

    return count[0].count;
  }

  async getOnePost(id: string): Promise<any | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."Posts"
      WHERE "Id" = $1
        AND "UserStatus" = false;
      `,
      [id],
    );
  }
  async getOnePostByPostAndBlogIds(
    postId: string,
    blogId: string,
  ): Promise<PostDocument | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."Posts"
      WHERE "Id" = $1 AND "BlogId" = $2 AND "UserStatus" = false;
      `,
      [postId, blogId],
    );
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
    return await this.dataSource.query(
      `
      SELECT * FROM public."Posts"
      WHERE "BlogId" = $1 AND "UserStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [id],
    );
  }

  // async getAllCommentsByPostId(
  //   postId: string,
  //   sort: { [key: string]: SortOrder },
  //   pagination: {
  //     skipValue: number;
  //     limitValue: number;
  //     pageSize: number;
  //     pageNumber: number;
  //   },
  //   userId?: string,
  // ): Promise<any> {
  //   const countDoc = await this.commentModel.countDocuments({ postId: postId });
  //   const pagesCount = Math.ceil(countDoc / pagination['pageSize']);
  //   const allComments = await this.commentModel
  //     .find({ $and: [{ postId: postId }, { isUserBanned: false }] })
  //     .sort(sort)
  //     .skip(pagination['skipValue'])
  //     .limit(pagination['limitValue'])
  //     .lean();
  //   return {
  //     pagesCount: pagesCount,
  //     page: pagination['pageNumber'],
  //     pageSize: pagination['pageSize'],
  //     totalCount: countDoc,
  //     items: await this.commentMapper.mapComments(allComments, userId),
  //   };
  // }
}
