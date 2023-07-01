import { DataSource } from 'typeorm';
import { PostCreationDto } from '../../dto/posts/dto/post.creation.dto';
import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { PostDocument } from '../../schemas/posts/schemas/posts.database.schema';
import { PostUpdateBody } from '../../dto/posts/dto/post.update.body';
import { InjectDataSource } from '@nestjs/typeorm';

export class PostsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(
    postDto: PostCreationDto,
    blog: BlogDocument,
  ): Promise<PostDocument | null> {
    return await this.dataSource.query(
      `
      INSERT INTO public."Posts" (
        "Title",
        "ShortDescription",
        "Content",
        "BlogId",
        "BlogName",
        "UserStatus",
        "OwnerId",
        "CreatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        "Id",
        "Title",
        "ShortDescription",
        "Content",
        "BlogId",
        "BlogName",
        "UserStatus",
        "CreatedAt"
      `,
      [
        postDto.title,
        postDto.shortDescription,
        postDto.content,
        postDto.blogId,
        postDto.blogName,
        false,
        postDto.ownerInfo.userId,
        new Date().toISOString(),
      ],
    );
  }

  async updatePost(id: string, postUpdateBody: PostUpdateBody) {
    const result = await this.dataSource.query(
      `
      UPDATE public."Posts"
      SET "Title" = $1, "ShortDescription" = $2, "Content" = $3
      WHERE "Id" = $4 AND "BlogId" = $5;
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
      DELETE FROM public."Posts"
      WHERE "Id" = $1;
      `,
      [id],
    );
    return result[1] === 1;
  }

  async deleteOnePostBySpecificBlogId(postId: string, blogId: string) {
    const result = await this.dataSource.query(
      `
      DELETE FROM public."Posts"
      WHERE "Id" = $1
        AND "BlogId" = $2;
      `,
      [postId, blogId],
    );
    return result[1] === 1;
  }

  async updateBanStatusForPostByOwnerId(userId: string, banStatus: boolean) {
    await this.dataSource.query(
      `
      UPDATE public."Posts" AS Posts
      SET "UserStatus" = $1
      FROM (SELECT * FROM public."Posts" AS Posts2
      LEFT JOIN public."Users" AS Info
        ON Info."Id" = Posts2."OwnerId" WHERE Info."Id" = $2) AS foo
      WHERE foo."IsBanned" = $1 
        AND foo."OwnerId" = $2;
      `,
      [banStatus, userId],
    );
  }
}
