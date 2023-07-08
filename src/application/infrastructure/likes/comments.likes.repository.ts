import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';
import { CommentsLike } from '../../entities/comments/comments.like.entity';

@Injectable()
export class CommentsLikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async deleteLikeDislikeForComment(
    userId: string,
    commentId: string,
    userStatus: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."comments_like"
      WHERE "userId" = $1
        AND "commentId" = $2
         AND "likeStatus" = $3
      `,
      [userId, commentId, userStatus],
    );

    return result[1] === 1;
  }

  async getUserStatusForComment(
    userId: string,
    commentId: string,
  ): Promise<CommentsLike[] | null> {
    return await this.dataSource.query(
      `
      SELECT "likeStatus" FROM public."comments_like"
      WHERE "userId" = $1
        AND "commentId" = $2;
      `,
      [userId, commentId],
    );
  }

  async likeComment(
    commentPostId: string,
    likeStatus: string,
    userId: string,
    userLogin: string,
  ): Promise<CommentsLike[] | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."comments_like" (
        "userId",
        "commentId",
        "likeStatus",
        "addedAt",
        "userStatus")
      VALUES ($1, $2, $3, $4, $5)
      `,
      [userId, commentPostId, likeStatus, new Date().toISOString(), false],
    );
  }

  async countAllLikesForComment(id: string): Promise<number> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."comments_like"
      WHERE "commentId" = $1
        AND "likeStatus" = 'Like'
         AND "userStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async countAllDislikesForComment(id: string): Promise<number> {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."comments_like"
      WHERE "commentId" = $1
        AND "likeStatus" = 'Dislike'
         AND "userStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async findLatestThreeLikes(commentId: string) {
    return await this.dataSource.query(
      `
      SELECT Users."id", Likes."addedAt", Users."id" FROM public."comments_like" AS Likes
      LEFT JOIN public."user" AS Users 
        ON Likes."userId" = Users."Id"
      WHERE Likes."commentId" = $1
        AND Likes."likeStatus" = 'Like'
          AND Likes."userStatus" = false
      ORDER BY Likes."addedAt" desc
      LIMIT 3 OFFSET 0;
      `,
      [commentId],
    );
  }

  async findAllLikesByUserIdAndSetBanStatus(
    userId: string,
    banStatus: boolean,
  ): Promise<CommentsLike[] | null> {
    return await this.dataSource.query(
      `
      UPDATE public."comments_like"
        SET "userStatus" = $1
      WHERE "userId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
