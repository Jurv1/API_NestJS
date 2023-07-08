import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllUsersForAdmin(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: string },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ) {
    return await this.dataSource.query(
      `
      SELECT 
        Users."id",
        Users."login",
        Users."email",
        Users."createdAt",
        Users."isBanned",
        Bans."banDate",
        Bans."banReason"
      FROM public."user" as Users
      LEFT JOIN public."bans_for_user_by_admin" as Bans
       ON Bans."userId" = Users."id"
      WHERE ("login" ILIKE $1 OR "email" ILIKE $2)
        AND ("isBanned" = $3 OR "isBanned" = $4)
      ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
      LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
      `,
      [
        filter['loginTerm'],
        filter['emailTerm'],
        filter['banCond'],
        filter['banCond1'],
      ],
    );
  }

  async countAllUsersRows(filter: { [key: string]: string | boolean }) {
    return await this.dataSource.query(
      `
      SELECT 
        COUNT(*)
      FROM public."user"
      WHERE ("login" ILIKE $1 OR "email" ILIKE $2)
        AND ("isBanned" = $3 OR "isBanned" = $4)  
      `,
      [
        filter['loginTerm'],
        filter['emailTerm'],
        filter['banCond'],
        filter['banCond1'],
      ],
    );
  }

  async getOneUserByLogin(login: string): Promise<UserDocument | null> {
    return await this.dataSource.query(
      `
    SELECT 
      "id",
      "login",
      "email",
      "password",
      "isBanned"
    FROM public."user"
    WHERE "login" = $1;
`,
      [login],
    );
  }

  async getOneByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return await this.dataSource.query(
      `
      SELECT "id", "isConfirmed", "login", "email"
      FROM public."user"
      WHERE "login" = $1
        OR "email" = $1;
      `,
      [loginOrEmail],
    );
  }

  async getOneUserById(id: string): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT * 
      FROM public."user"
      WHERE "id" = $1;
      `,
      [id],
    );
  }

  async getOneByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT Users."id", "isConfirmed", "confirmationCode", "expirationDate"
      FROM public."email_confirmation_for_users" AS Email
          LEFT JOIN public."user" AS Users ON "confirmationCode" = $1
      WHERE Users."id" = Email."userId";
      `,
      [confirmationCode],
    );
  }

  async getOneByPassCode(code: string): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT Users."id", "recoveryCode", "expirationDate"
      FROM public."password_recovery_for_users" AS Pass
          LEFT JOIN public."user" AS Users ON "RecoveryCode" = $1
      WHERE Users."id" = Pass."userId";
      `,
      [code],
    );
  }

  async getConfirmationCodeByUserId(id: string) {
    return await this.dataSource.query(
      `
      SELECT "confirmationCode" AS code
      FROM public."email_confirmation_for_users"
      WHERE
        "userId" = $1;  
      `,
      [id],
    );
  }
}
