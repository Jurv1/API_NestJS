import { DataSource } from 'typeorm';
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
      SELECT * FROM public."Posts" AS Posts
      LEFT JOIN public."BlogsOwnerInfo" AS Info 
        ON Info."BlogId" = Posts."BlogId"
      WHERE Posts."Id" = $1 AND Posts."BlogId" = $2 AND Posts."UserStatus" = false;
      `,
      [postId, blogId],
    );
  }
  async getAllPostsByBlogId(
    id: string,
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
      WHERE "BlogId" = $1 AND "UserStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [id],
    );
  }

  async countAllPostsByBlogId(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."Posts"
      WHERE "BlogId" = $1 AND "UserStatus" = false;
      `,
      [id],
    );
    return counts[0].count;
  }

  async getAllCommentsByPostId(
    postId: string,
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
      SELECT * FROM public."Comments"
      WHERE "PostId" = $1
        AND "UserStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [postId],
    );
  }

  async countAllCommentsByPostId(postId: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."Comments"
      WHERE "PostId" = $1
        AND "UserStatus" = false;
      `,
      [postId],
    );

    return counts[0].count;
  }
}
