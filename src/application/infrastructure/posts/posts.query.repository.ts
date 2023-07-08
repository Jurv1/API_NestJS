import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Post } from '../../entities/posts/post.entity';
import { Comment } from '../../entities/comments/comment.entity';

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
  ): Promise<Post[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."post" AS Posts
      LEFT JOIN public."blog" AS Blogs
        ON Posts."blogId" = Blogs."id"
      WHERE "userStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
    );
  }

  async countAllPosts(): Promise<number> {
    const count = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."post";
      `,
    );

    return count[0].count;
  }

  async getOnePost(id: string): Promise<Post[] | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."post"
      LEFT JOIN public."blog" AS Blogs
        ON Posts."blogId" = Blogs."id"
      WHERE "id" = $1
        AND "userStatus" = false;
      `,
      [id],
    );
  }
  async getOnePostByPostAndBlogIds(
    postId: string,
    blogId: string,
  ): Promise<Post[] | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."post" AS Posts
      LEFT JOIN public."blog" AS Info 
        ON Info."id" = Posts."blogId"
      WHERE Posts."id" = $1 AND Posts."blogId" = $2 AND Posts."userStatus" = false;
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
  ): Promise<Post[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."post"
      LEFT JOIN public."blog" AS Blogs
        ON Posts."blogId" = Blogs."id"
      WHERE "blogId" = $1 AND "userStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [id],
    );
  }

  async countAllPostsByBlogId(id: string): Promise<number> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."post"
      WHERE "blogId" = $1 AND "userStatus" = false;
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
  ): Promise<Comment[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."comment"
      WHERE "postId" = $1
        AND "userStatus" = false
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [postId],
    );
  }

  async countAllCommentsByPostId(postId: string): Promise<number> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."comment"
      WHERE "postId" = $1
        AND "userStatus" = false;
      `,
      [postId],
    );

    return counts[0].count;
  }
}
