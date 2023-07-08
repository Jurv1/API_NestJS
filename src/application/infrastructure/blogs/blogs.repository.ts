import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlogCreationDto } from '../../dto/blogs/dto/blog.creation.dto';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogBody } from '../../dto/blogs/dto/body/blog.body';
import { BannedUserDto } from '../../dto/blogs/dto/banned.user.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(blogDto: BlogCreationDto): Promise<any | null> {
    const createdBlog: BlogDocument = await this.dataSource.query(
      `
      INSERT INTO public."blog" (
        "name",
        "description",
        "websiteUrl",
        "isMembership",
        "isBanned",
        "ownerId",
        "ownerLogin",
        "ownerStatus",
        "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING "id", "name", "description", "websiteUrl", "createdAt",
        "isMembership";
      `,
      [
        blogDto.name,
        blogDto.description,
        blogDto.websiteUrl,
        false,
        false,
        blogDto.userId,
        blogDto.userLogin,
        false,
        new Date().toISOString(),
      ],
    );
    return createdBlog;
  }

  async updateOne(blogId: string, blogBody: BlogBody): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      UPDATE public."blog"
      SET "name" = $1, "description" = $2, "websiteUrl" = $3
      WHERE "id" = $4;
      `,
      [blogBody.name, blogBody.description, blogBody.websiteUrl, blogId],
    );

    return result[1] === 1;
  }

  async updateBanInfoForBlogs(
    blogId: string,
    date: string | null,
    isBanned: boolean,
  ) {
    await this.dataSource.query(
      `
      UPDATE public."blog"
      SET "isBanned" = $1, "banDate" = $2
      WHERE "id" = $3;
      `,
      [isBanned, date, blogId],
    );
  }

  async updateIsBannedForBlogs(
    userId: string,
    date: string,
    isBanned: boolean,
  ) {
    await this.dataSource.query(
      `
      UPDATE public."blog" AS Blogs
        SET "IsBanned" = $1, "BanDate" = $2
      FROM (SELECT Blogs2."Id" FROM public."Blogs" AS Blogs2
                LEFT JOIN public."BlogsOwnerInfo" AS Infos 
                    ON Infos."BlogId" = Blogs2."Id"
                WHERE Infos."OwnerId" = $3) AS foo
      WHERE Blogs."Id" = foo."Id";
      `,
      [isBanned, date, userId],
    );
  }

  async addBlogToBan(blogId: string) {
    await this.dataSource.query(
      `
      INSERT INTO public."BlogsBansByAdmin" ("BlogId", "BanDate")
      VALUES  ($1, $2);
      `,
      [blogId, new Date().toISOString()],
    );
  }

  async removeBlogToBan(blogId: string) {
    await this.dataSource.query(
      `
      DELETE FROM public."BlogsBansByAdmin"
      WHERE "BlogId" = $1;
      `,
      [blogId],
    );
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."Blogs"
      WHERE "Id" = $1;
      `,
      [id],
    );

    return result[1] === 1;
  }

  async bindUser(userId: number, userLogin: string, blogId: number) {
    return await this.dataSource.query(
      `
      INSERT INTO public."BlogsOwnerInfo" ("OwnerId", "UserLogin", "BlogId")
      VALUES ($1, $2, $3) 
      `,
      [userId, userLogin, blogId],
    );
  }

  async updateBanStatusForBlogsByOwnerId(blogId: string) {
    return await this.dataSource.query(
      `
      INSERT INTO public."BlogsBansByAdmin" ("BlogId", "BanDate")
        VALUES ($1, $2)
      ON CONFLICT("BlogId") DO
        UPDATE public."BlogsBansByAdmin" 
            SET "BanDate" = EXCLUDED.BanDate;
      `,
      [blogId, new Date().toISOString()],
    );
  }

  async banUserInBlog(blogId: string, bannedUser: BannedUserDto) {
    return await this.dataSource.query(
      `
      INSERT INTO public."BannedUsersByBlogger" 
        ("BlogId", "UserId", "BanReason", "BanDate")
      VALUES ($1, $2, $3, $4);
      `,
      [
        blogId,
        bannedUser.id,
        bannedUser.banInfo.banReason,
        bannedUser.banInfo.banDate,
      ],
    );
  }

  async unbanUserInBlog(blogId: string, userId: string) {
    await this.dataSource.query(
      `
      DELETE FROM public."BannedUsersByBlogger" 
      WHERE "BlogId" = $1
        AND "UserId" = $2;
      `,
      [blogId, userId],
    );
  }
}
