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
       public."banned_users_by_blogger";
       DELETE FROM
       public."comments_like";
       DELETE FROM
       public."posts_like";
       DELETE FROM
       public."bans_for_user_by_admin";
       DELETE FROM
       public."device";
       DELETE FROM
       public."email_confirmation_for_users";
       DELETE FROM
       public."password_recovery_for_users";
       DELETE FROM
       public."comment";
       DELETE FROM
       public."blog_bans_by_admin";
       DELETE FROM
       public."blog";
       DELETE FROM
       public."post";
       DELETE FROM
       public."user";
      `,
    );
  }
}
