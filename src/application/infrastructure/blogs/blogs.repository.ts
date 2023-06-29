import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlogCreationDto } from '../../dto/blogs/dto/blog.creation.dto';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogBody } from '../../dto/blogs/dto/body/blog.body';
import { BannedUserDto } from '../../dto/blogs/dto/banned.user.dto';
import { BanInfo } from '../../schemas/users/schemas/ban.info.schema';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(blogDto: BlogCreationDto): Promise<any | null> {
    const createdBlog: BlogDocument = await this.dataSource.query(
      `
      INSERT INTO public."Blogs" (
        "Name",
        "Description",
        "WebsiteUrl",
        "IsMembership",
        "IsBanned",
        "CreatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "Id", "Name", "Description", "WebsiteUrl", "CreatedAt",
        "IsMembership";
      `,
      [
        blogDto.name,
        blogDto.description,
        blogDto.websiteUrl,
        false,
        false,
        new Date().toISOString(),
      ],
    );

    await this.dataSource.query(
      `
      INSERT INTO public."BlogsOwnerInfo" ("BlogId", "OwnerId", "OwnerLogin")
      VALUES($1, $2, $3);
      `,
      [createdBlog[0].Id, blogDto.userId, blogDto.userLogin],
    );

    return createdBlog;
  }

  async updateOne(blogId: string, blogBody: BlogBody): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      UPDATE public."Blogs"
      SET "Name" = $1, "Description" = $2, "WebsiteUrl" = $3
      WHERE "Id" = $4;
      `,
      [blogBody.name, blogBody.description, blogBody.websiteUrl, blogId],
    );

    return result[1] === 1;
  }

  async updateBanInfoForBlogs(blogId: string, isBanned: boolean) {
    await this.dataSource.query(
      `
      UPDATE public."Blogs"
      SET "IsBanned" = $1
      WHERE "Id" = $2;
      `,
      [blogId, isBanned],
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
    const result = await this.dataSource.query(
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

    return result;
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
