import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentCreatingDto } from '../../dto/comments/dto/comment.creating.dto';
import { Comment } from '../../entities/comments/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async createComment(
    commentCreationDTO: CommentCreatingDto,
  ): Promise<Comment[] | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."comment" (
        "content",
        "postId",
        "commentatorId",
        "commentatorLogin",
        "userStatus",
        "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "id",
        "content",
        "postId",
        "commentatorId",
        "commentatorLogin",
        "createdAt" 
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
    const result = await this.commentRepo
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where('id = :id', { id: id })
      .execute();

    // const result = await this.dataSource.query(
    //   `
    //   DELETE FROM public."comment"
    //   WHERE "id" = $1;
    //   `,
    //   [id],
    // );
    return result[1] === 1;
  }

  async updateBanStatusForCommentOwner(userId: string, banStatus: boolean) {
    return await this.commentRepo
      .createQueryBuilder()
      .update(Comment)
      .set({ userStatus: banStatus })
      .where('commentatorId = :id', { id: userId })
      .execute();

    // return await this.dataSource.query(
    //   `
    //   UPDATE public."comment"
    //   SET "userStatus" = $1
    //   WHERE "commentatorId" = $2;
    //   `,
    //   [banStatus, userId],
    // );
  }

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await this.commentRepo
      .createQueryBuilder()
      .update(Comment)
      .set({ content: content })
      .where('id = :id', { id: id })
      .execute();

    // const result = await this.dataSource.query(
    //   `
    //   UPDATE public."comments"
    //   SET "content" = $1
    //   WHERE "id" = $2;
    //   `,
    //   [content, id],
    // );

    return result[1] === 1;
  }
}
