import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogWithPaginationDto } from '../../dto/blogs/dto/view/blog.with.pagination.dto';

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
  ): Promise<BlogWithPaginationDto> {
    return await this.dataSource.query(
      `
      SELECT * FROM public."Blogs" 
      WHERE "IsBanned" = false
        AND "Name" ILIKE $1
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
      SELECT COUNT(*) FROM public."Blogs"
      WHERE "IsBanned" = false
        AND "Name" ILIKE $1;
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
  ) {
    return await this.dataSource.query(
      `
      SELECT * FROM public."Blogs" AS Blogs
      LEFT JOIN public."BlogsOwnerInfo" AS Info 
        ON Blogs."Id" = Info."BlogId"
      WHERE "Name" ILIKE $1
        AND Info."OwnerId" = $2
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [filter['nameTerm'], userId],
    );
  }

  async countBlogsForBlogger(
    filter: { [key: string]: string | boolean },
    userId: string,
  ) {
    const result = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."Blogs" AS Blogs
      LEFT JOIN public."BlogsOwnerInfo" AS Info 
        ON Blogs."Id" = Info."BlogId"
      WHERE Info."OwnerId" = $1
        AND "Name" ILIKE $2;
      `,
      [userId, filter['nameTerm']],
    );

    return result[0].count;
  }

  async getAllBannedUsersForBlogger(blogId: string) {
    return this.dataSource.query(
      `
      SELECT 
        Users."Id",
        Users."Login",
        BannedUsers."BanReason",
        BannedUsers."BanDate"
      FROM public."BannedUsersByBlogger" AS BannedUsers
       LEFT JOIN public."Users" AS Users 
        ON BannedUsers."UserId" = Users."Id"
      WHERE BannedUsers."BlogId" = $1;
      `,
      [blogId],
    );
  }

  // async getSlicedBannedUsers(
  //   filter: any,
  //   sort: any,
  //   from: number,
  //   size: number,
  // ): Promise<BlogDocument | null> {
  //   return this.blogModel
  //     .find(filter, {}, { bannedUsersForBlog: { $slice: [from, size] } })
  //     .sort(sort)
  //     .limit(size)
  //     .lean();
  // }

  async getOneBlog(id: string): Promise<any | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."Blogs"
      WHERE "Id" = $1 
        AND "IsBanned" = false;
      `,
      [id],
    );
  }

  async getOwnerIdAndBlogIdForBlogger(
    id: string,
  ): Promise<BlogDocument | null> {
    return this.dataSource.query(
      `
      SELECT Info."OwnerId", Blogs."Id" FROM public."Blogs" as Blogs
      LEFT JOIN public."BlogsOwnerInfo" as Info
        ON Blogs."Id" = Info."BlogId"
      WHERE Blogs."Id" = $1;
      `,
      [id],
    );
  }

  async getOneBlogForAdmin(id: string): Promise<BlogDocument | null> {
    return this.dataSource.query(
      `
      SELECT * FROM public."Blogs"
      WHERE "Id" = $1;
      `,
      [id],
    );
  }
}
