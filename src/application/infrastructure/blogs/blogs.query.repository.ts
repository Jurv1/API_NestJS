import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../../entities/blogs/blog.entity';
import { User } from '../../entities/users/user.entity';
import { BannedUsersByBlogger } from '../../entities/users/banned.users.by.blogger.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(BannedUsersByBlogger)
    private readonly bansRepo: Repository<BannedUsersByBlogger>,
  ) {}

  async getAllBlogs(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: 'ASC' | 'DESC' },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<[Blog[], number]> {
    return await this.blogsRepo
      .createQueryBuilder()
      .select('blog')
      .from(Blog, 'blog')
      .where('isBanned = false AND name ILIKE :name', {
        name: filter['nameTerm'],
      })
      .orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      .skip(pagination.skipValue)
      .take(pagination.limitValue)
      .getManyAndCount();
  }

  async countAllBlogs(filter: {
    [key: string]: string | boolean;
  }): Promise<number> {
    return await this.blogsRepo
      .createQueryBuilder()
      .where('isBanned = false')
      .andWhere('name ILIKE :name', { name: filter['nameTerm'] })
      .getCount();
  }

  async getAllBlogsForAdmin(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: 'ASC' | 'DESC' },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<[Blog[], number]> {
    return await this.blogsRepo
      .createQueryBuilder()
      .select('blog')
      .from(Blog, 'blog')
      .where('name ILIKE :name', { name: filter['nameTerm'] })
      .orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      .skip(pagination.skipValue)
      .take(pagination.limitValue)
      .getManyAndCount();
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
    sort: { [key: string]: 'ASC' | 'DESC' },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    userId: string,
  ): Promise<[Blog[], number]> {
    return await this.blogsRepo
      .createQueryBuilder()
      .select()
      .from(Blog, 'blog')
      .subQuery()
      .where('name ILIKE :name', { name: filter['nameTerm'] })
      .andWhere('ownerId = :id', { id: userId })
      .orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      .skip(pagination.skipValue)
      .take(pagination.limitValue)
      .getManyAndCount();
  }

  async countBlogsForBlogger(
    filter: { [key: string]: string | boolean },
    userId: string,
  ): Promise<number> {
    return await this.blogsRepo
      .createQueryBuilder()
      .where('name ILIKE :name', { name: filter['nameTerm'] })
      .andWhere('ownerId = :id', { id: userId })
      .getCount();
  }

  async getAllBannedUsersForBlogger(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: 'ASC' | 'DESC' },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
    blogId: string,
  ): Promise<Blog[]> {
    return await this.blogsRepo
      .createQueryBuilder('bans')
      .leftJoinAndSelect('bans.bannedUsersByBlogger', 'u')
      .where('bans.blogId = :id', { id: blogId })
      .andWhere('u.login ILIKE :login', { login: filter['loginTerm'] })
      .orderBy(`${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      .skip(pagination.skipValue)
      .take(pagination.limitValue)
      .getMany();
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

  async getOneBlog(id: string): Promise<Blog | null> {
    return this.blogsRepo.findOne({ where: { id: +id, isBanned: false } });
  }

  async getOwnerIdAndBlogIdForBlogger(id: string): Promise<Blog[] | null> {
    return this.blogsRepo
      .createQueryBuilder()
      .select('ownerId')
      .addSelect('id')
      .from(Blog, 'blog')
      .where('id = :id', { id: id })
      .getRawOne();
  }

  async getOneBlogForAdmin(id: string): Promise<Blog | null> {
    return this.blogsRepo.findOne({ where: { id: +id } });
  }
}
