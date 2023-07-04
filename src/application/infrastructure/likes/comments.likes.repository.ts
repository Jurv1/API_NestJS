import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeDocument } from '../../schemas/likes/schemas/like.database.schema';

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
      DELETE FROM public."CommentsLikes"
      WHERE "UserId" = $1
        AND "CommentId" = $2
         AND "UserStatus" = $3
      `,
      [userId, commentId, userStatus],
    );

    return result[1] === 1;
  }

  async getUserStatusForComment(
    userId: string,
    commentId: string,
  ): Promise<any | null> {
    await this.dataSource.query(
      `
      SELECT "UserStatus" FROM public."CommentsLikes"
      WHERE "UserId" = $1
        AND "CommentId" = $2;
      `,
      [userId, commentId],
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
      INSERT INTO public."CommentsLikes" ("UserId", "CommentId", "LikeStatus", "AddedAt", "UserStatus")
      VALUES ($1, $2, $3, $4, $5)
      `,
      [userId, commentPostId, likeStatus, new Date().toISOString(), false],
    );
  }

  async countAllLikesForComment(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."CommentsLikes"
      WHERE "CommentId" = $1
        AND "LikeStatus" = 'Like'
         AND "UserStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async countAllDislikesForComment(id: string) {
    const counts = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM public."CommentsLikes"
      WHERE "CommentId" = $1
        AND "LikeStatus" = 'Dislike'
         AND "UserStatus" = false;
      `,
      [id],
    );

    return +counts[0].count;
  }

  async findLatestThreeLikes(commentId: string) {
    return await this.dataSource.query(
      `
      SELECT Users."Id", Likes."AddedAt", Users."Id" FROM public."CommentsLikes" AS Likes
      LEFT JOIN public."Users" AS Users 
        ON Likes."UserId" = Users."Id"
      WHERE Likes."CommentId" = $1
        AND Likes."LikeStatus" = 'Like'
          AND Likes."UserStatus" = false
      ORDER BY Likes."AddedAt" desc
      LIMIT 3 OFFSET 0;
      `,
      [commentId],
    );
  }

  async findAllLikesByUserIdAndSetBanStatus(
    userId: string,
    banStatus: boolean,
  ) {
    return await this.dataSource.query(
      `
      UPDATE public."CommentsLikes"
        SET "UserStatus" = $1
      WHERE "UserId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
