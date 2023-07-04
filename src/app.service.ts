import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async deleteAll() {
    await this.dataSource.query(
      `
       DELETE FROM
       public."BannedUsersByBlogger";
       DELETE FROM
       public."CommentsLikes";
       DELETE FROM
       public."PostsLikes";
       DELETE FROM
       public."BansForUsersByAdmin";
       DELETE FROM
       public."BlogsOwnerInfo";
       DELETE FROM
       public."BannedUsersByBlogger";
       DELETE FROM
       public."Devices";
       DELETE FROM
       public."EmailConfirmationForUsers";
       DELETE FROM
       public."PasswordRecoveryForUsers";
       DELETE FROM
       public."Comments";
       DELETE FROM
       public."Blogs";
       DELETE FROM
       public."Posts";
       DELETE FROM
       public."Users";
      `,
    );
  }
}
