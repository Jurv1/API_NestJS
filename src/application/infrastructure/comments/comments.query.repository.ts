import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Comment } from '../../entities/comments/comment.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getOneComment(id: string): Promise<Comment[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."comment"
      WHERE "id" = $1
        AND "userStatus" = false
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
  ): Promise<Comment[] | null> {
    return await this.dataSource.query(
      `
      SELECT
       Comments."id",
       Comments."content",
       Comments."commentatorId",
       Blogs."ownerLogin" AS CommentatorLogin,
       Comments."createdAt",
       Posts."id" AS PostId,
       Posts."title",
       Posts."blogId",
       Blogs."blogName"  
      FROM public."comment" AS Comments
      LEFT JOIN public."post" AS Posts
        ON Posts."id" = Comments."postId"
      LEFT JOIN public."blog" AS Blogs
        ON Blogs."id" = Posts."blogId"
      WHERE 
        Blogs."ownerId" = $1
      ORDER BY Comments."${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [blogOwnerId],
    );
  }

  async countAllComments(blogOwnerId: string): Promise<number> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."comment" AS Comments
      LEFT JOIN public."post" AS Posts
        ON Posts."id" = Comments."postId"
      LEFT JOIN public."blog" AS Blogs
        ON Blogs."id" = Posts."blogId"
      WHERE 
        Blogs."ownerId" = $1
      `,
      [blogOwnerId],
    );

    return counts[0].count;
  }
}
