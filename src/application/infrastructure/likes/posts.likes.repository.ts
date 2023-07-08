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
      DELETE FROM public."posts_like"
      WHERE "userId" = $1
        AND "postId" = $2
         AND "likeStatus" = $3
      `,
      [userId, postId, userStatus],
    );

    return result[1] === 1;
  }

  async getUserStatusForPost(
    userId: string,
    postId: string,
  ): Promise<any | null> {
    return await this.dataSource.query(
      `
      SELECT "likeStatus" FROM public."posts_like"
      WHERE "userId" = $1
        AND "postId" = $2;
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
      INSERT INTO public."posts_like" (
        "userId",
        "postId",
        "likeStatus",
        "addedAt",
        "userStatus")
      VALUES ($1, $2, $3, $4, $5)
      `,
      [userId, commentPostId, likeStatus, new Date().toISOString(), false],
    );
  }

  async countAllLikesForPost(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."posts_like"
      WHERE "postId" = $1
        AND "likeStatus" = 'Like'
         AND "userStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async countAllDislikesForPost(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."posts_like"
      WHERE "postId" = $1
        AND "likeStatus" = 'Dislike'
         AND "userStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async findLatestThreeLikes(postId: string) {
    return await this.dataSource.query(
      `
      SELECT Users."id", Likes."addedAt", Users."login" FROM public."posts_like" AS Likes
      LEFT JOIN public."user" AS Users 
        ON Likes."userId" = Users."id"
      WHERE Likes."postId" = $1
        AND Likes."likeStatus" = 'Like'
          AND Likes."userStatus" = false
      ORDER BY Likes."addedAt" DESC
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
      UPDATE public."posts_like"
        SET "userStatus" = $1
      WHERE "userId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
