import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';

@Injectable()
export class PostsLikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async deleteLikeDislikeForPost(
    userId: string,
    postId: string,
    userStatus: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."PostsLikes"
      WHERE "UserId" = $1
        AND "PostId" = $2
         AND "UserStatus" = $3
      `,
      [userId, postId, userStatus],
    );

    return result[1] === 1;
  }

  async getUserStatusForPost(
    userId: string,
    postId: string,
  ): Promise<any | null> {
    await this.dataSource.query(
      `
      SELECT "UserStatus" FROM public."PostsLikes"
      WHERE "UserId" = $1
        AND "PostId" = $2;
      `,
      [userId, postId],
    );
  }

  async likeComment(
    commentPostId: string,
    likeStatus: string,
    userId: string,
    userLogin: string,
  ): Promise<LikeDocument | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."PostsLikes" ("UserId", "PostId", "LikeStatus", "AddedAt")
      VALUES ($1, $2, $3, $4)
      `,
      [userId, commentPostId, likeStatus, new Date().toISOString()],
    );
  }

  async countAllLikesForPost(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."PostsLikes"
      WHERE "PostId" = $1
        AND "LikeStatus" = 'Like'
         AND "UserStatus" = false;
      `,
      [id],
    );

    return counts[0].count;
  }

  async countAllDislikesForPost(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."PostsLikes"
      WHERE "PostId" = $1
        AND "LikeStatus" = 'Dislike'
         AND "UserStatus" = false;
      `,
      [id],
    );

    return counts[0].count;
  }

  async findLatestThreeLikes(postId: string) {
    return await this.dataSource.query(
      `
      SELECT Users."Id", Likes."AddedAt", Users."Id" FROM public."PostsLikes" AS Likes
      LEFT JOIN public."Users" AS Users 
        ON Likes."UserId" = Users."Id"
      WHERE Likes."PostId" = $1
        AND Likes."UserStatus" = 'Like'
          AND Likes."UserStatus" = false
      ORDER BY Likes."AddedAt" desc
      LIMIT 3 OFFSET 0;
      `,
      [postId],
    );
  }

  async findAllLikesByUserIdAndSetBanStatus(
    userId: string,
    banStatus: boolean,
  ) {
    return await this.dataSource.query(
      `
      UPDATE public."PostsLikes"
        SET "UserStatus" = $1
      WHERE "UserId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
