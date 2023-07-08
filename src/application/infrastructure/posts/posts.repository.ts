import { DataSource } from 'typeorm';
import { PostCreationDto } from '../../dto/posts/dto/post.creation.dto';
import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { PostUpdateBody } from '../../dto/posts/dto/post.update.body';
import { InjectDataSource } from '@nestjs/typeorm';
import { Post } from '../../entities/posts/post.entity';

export class PostsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(postDto: PostCreationDto): Promise<Post[] | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."post" (
        "title",
        "shortDescription",
        "content",
        "blogId",
        "userStatus",
        "ownerId",
        "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        "id",
        "title",
        "shortDescription",
        "content",
        "blogId",
        "userStatus",
        "createdAt"
      `,
      [
        postDto.title,
        postDto.shortDescription,
        postDto.content,
        postDto.blogId,
        false,
        postDto.ownerInfo.userId,
        new Date().toISOString(),
      ],
    );
  }

  async updatePost(id: string, postUpdateBody: PostUpdateBody) {
    const result = await this.dataSource.query(
      `
      UPDATE public."post"
      SET "title" = $1, "shortDescription" = $2, "content" = $3
      WHERE "id" = $4 AND "blogId" = $5;
      `,
      [
        postUpdateBody.title,
        postUpdateBody.shortDescription,
        postUpdateBody.content,
        id,
        postUpdateBody.blogId,
      ],
    );

    return result[1] === 1;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."post"
      WHERE "id" = $1;
      `,
      [id],
    );
    return result[1] === 1;
  }

  async deleteOnePostBySpecificBlogId(
    postId: string,
    blogId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."post"
      WHERE "id" = $1
        AND "blogId" = $2;
      `,
      [postId, blogId],
    );
    return result[1] === 1;
  }

  async updateBanStatusForPostByOwnerId(userId: string, banStatus: boolean) {
    await this.dataSource.query(
      `
      UPDATE public."post" AS Posts
      SET "userStatus" = $1
      FROM (SELECT * FROM public."post" AS Posts2
      LEFT JOIN public."user" AS Info
        ON Info."id" = Posts2."ownerId" WHERE Info."id" = $2) AS foo
      WHERE foo."isBanned" = $1 
        AND foo."ownerId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
