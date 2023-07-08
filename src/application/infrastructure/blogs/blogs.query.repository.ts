import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogWithPaginationDto } from '../../dto/blogs/dto/view/blog.with.pagination.dto';
import { Blog } from '../../entities/blogs/blog.entity';
import { User } from '../../entities/users/user.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAllBlogs(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<Blog[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."blog" 
      WHERE "isBanned" = false
        AND "name" ILIKE $1
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [filter['nameTerm']],
    );
  }

  async countAllBlogs(filter: {
    [key: string]: string | boolean;
  }): Promise<number> {
    const result = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."blog"
      WHERE "isBanned" = false
        AND "name" ILIKE $1;
      `,
      [filter['nameTerm']],
    );

    return result[0].count;
  }

  async getAllBlogsForAdmin(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<Blog[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."blog" AS Blogs
      WHERE "name" ILIKE $1
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};  
      `,
      [filter['nameTerm']],
    );
  }

  async countAllBlogsForAdmin(filter: {
    [key: string]: string | boolean;
  }): Promise<number> {
    const result = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."blog"
      WHERE "name" ILIKE $1;
      `,
      [filter['nameTerm']],
    );

    return result[0].count;
  }

  async getAllBlogsForBlogger(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId: string,
  ): Promise<Blog[] | null> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."blog" AS Blogs
      WHERE "name" ILIKE $1
        AND Info."ownerId" = $2
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [filter['nameTerm'], userId],
    );
  }

  async countBlogsForBlogger(
    filter: { [key: string]: string | boolean },
    userId: string,
  ): Promise<string> {
    const result = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."blog" AS Blogs
      WHERE Info."ownerId" = $1
        AND "name" ILIKE $2;
      `,
      [userId, filter['nameTerm']],
    );

    return result[0].count;
  }

  async getAllBannedUsersForBlogger(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    blogId: string,
  ): Promise<User[] | null> {
    return this.dataSource.query(
      `
      SELECT 
        Users."id",
        Users."login",
        BannedUsers."banReason",
        BannedUsers."banDate"
      FROM public."banned_users_by_blogger" AS BannedUsers
       LEFT JOIN public."user" AS Users 
        ON BannedUsers."userId" = Users."id"
      WHERE BannedUsers."blogId" = $1
        AND Users."login" ILIKE $2
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [blogId, filter['loginTerm']],
    );
  }

  async getAllBannedForBlogWithoutFilters(
    blogId: string,
  ): Promise<User[] | null> {
    return await this.dataSource.query(
      `
      SELECT 
        Users."id",
        Users."login",
        BannedUsers."banReason",
        BannedUsers."banDate"
      FROM public."banned_users_by_blogger" AS BannedUsers
       LEFT JOIN public."user" AS Users 
        ON BannedUsers."userId" = Users."Id"
      WHERE BannedUsers."blogId" = $1;
      `,
      [blogId],
    );
  }

  async countAllBannedUsers(
    filter: { [key: string]: string | boolean },
    blogId: string,
  ): Promise<string> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*)
      FROM public."banned_users_by_blogger" AS BannedUsers
       LEFT JOIN public."user" AS Users 
        ON BannedUsers."userId" = Users."Id"
      WHERE BannedUsers."blogId" = $1
        AND Users."login" ILIKE $2
      `,
      [blogId, filter['loginTerm']],
    );

    return counts[0].count;
  }

  async getOneBlog(id: string): Promise<Blog[] | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."blog"
      WHERE "id" = $1 
        AND "isBanned" = false;
      `,
      [id],
    );
  }

  async getOwnerIdAndBlogIdForBlogger(id: string): Promise<Blog[] | null> {
    return this.dataSource.query(
      `
      SELECT "ownerId", "id" FROM public."blog"
      WHERE "id" = $1;
      `,
      [id],
    );
  }

  async getOneBlogForAdmin(id: string): Promise<Blog[] | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."blog"
      WHERE "id" = $1;
      `,
      [id],
    );
  }
}
