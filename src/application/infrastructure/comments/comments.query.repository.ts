import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getOneComment(id: string): Promise<any | null> {
    await this.dataSource.query(
      `
      SELECT * FROM public."Comments"
      WHERE "Id" = $1
        AND "UserStatus" = false
      `,
      [id],
    );
  }

  async getCommentsForBlog(
    blogOwnerId: string,
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {
    return await this.dataSource.query(
      `
      SELECT * FROM public."Comments" AS Comments
      LEFT JOIN public."Posts" AS Posts
        ON Posts."Id" = Comments."PostId"
      LEFT JOIN public."Blogs" AS Blogs
        ON Blogs."Id" = Posts."BlogId"
      LEFT JOIN public."BlogsOwnerInfo" AS BlogInfo
        ON BlogInfo."BlogId" = Blogs."Id"
      WHERE 
        BlogInfo."OwnerId" = $1
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
    );
  }

  async countAllComments(blogOwnerId: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."Comments" AS Comments
      LEFT JOIN public."Posts" AS Posts
        ON Posts."Id" = Comments."PostId"
      LEFT JOIN public."Blogs" AS Blogs
        ON Blogs."Id" = Posts."BlogId"
      LEFT JOIN public."BlogsOwnerInfo" AS BlogInfo
        ON BlogInfo."BlogId" = Blogs."Id"
      WHERE 
        BlogInfo."OwnerId" = $1
      `,
      [blogOwnerId],
    );

    return counts[0].count;
  }
}
