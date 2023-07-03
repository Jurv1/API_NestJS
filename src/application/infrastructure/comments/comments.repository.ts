import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentCreatingDto } from '../../dto/comments/dto/comment.creating.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createComment(commentCreationDTO: CommentCreatingDto) {
    return await this.dataSource.query(
      `
      INSERT INTO public."Comments" (
        "Content",
        "PostId",
        "CommentatorId",
        "CommentatorLogin",
        "UserStatus",
        "CreatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "Id",
        "Content",
        "PostId",
        "CommentatorId",
        "CommentatorLogin",
        "CreatedAt" 
      `,
      [
        commentCreationDTO.content,
        commentCreationDTO.postInfo.id,
        commentCreationDTO.commentatorInfo.userId,
        commentCreationDTO.commentatorInfo.userLogin,
        false,
        new Date().toISOString(),
      ],
    );
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."Comments"
      WHERE "Id" = $1;
      `,
      [id],
    );
    return result[1] === 1;
  }

  async updateBanStatusForCommentOwner(userId: string, banStatus: boolean) {
    return await this.dataSource.query(
      `
      UPDATE public."Comments"
      SET "UserStatus" = $1
      WHERE "CommentatorId" = $2;
      `,
      [banStatus, userId],
    );
  }

  async updateCommentById(id: string, content: string) {
    const result = await this.dataSource.query(
      `
      UPDATE public."Comments"
      SET "Content" = $1
      WHERE "Id" = $2;
      `,
      [content, id],
    );

    return result[1] === 1;
  }
}
