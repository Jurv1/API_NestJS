import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // async getAllUsers(
  //   filter: any,
  //   sort: { [key: string]: SortOrder },
  //   pagination: {
  //     skipValue: number;
  //     limitValue: number;
  //     pageSize: number;
  //     pageNumber: number;
  //   },
  // ): Promise<any> {
  //   const allUsers = await this.userModel
  //     .find(filter)
  //     .sort(sort)
  //     .skip(pagination['skipValue'])
  //     .limit(pagination['limitValue'])
  //     .lean();
  //
  //   const countDocs = await this.userModel.countDocuments(filter);
  //   const pagesCount = Math.ceil(countDocs / pagination['pageSize']);
  //
  //   return {
  //     pagesCount: pagesCount,
  //     page: pagination['pageNumber'],
  //     pageSize: pagination['pageSize'],
  //     totalCount: countDocs,
  //     items: allUsers,
  //   };
  // }
  //
  // async getAllUsersInBannedBlog(
  //   filter,
  //   sort: { [key: string]: SortOrder },
  //   pagination: {
  //     skipValue: number;
  //     limitValue: number;
  //     pageSize: number;
  //     pageNumber: number;
  //   },
  // ): Promise<UserDocument[]> {
  //   return this.userModel
  //     .find(filter)
  //     .sort(sort)
  //     .skip(pagination.skipValue)
  //     .limit(pagination.limitValue)
  //     .lean();
  // }

  async getOneUserByLogin(login: string): Promise<UserDocument | null> {
    return await this.dataSource.query(
      `
    SELECT 
      "Id",
      "Login",
      "Email",
      "Password"
    FROM public."Users"
    WHERE "Login" = $1;
`,
      [login],
    );
  }

  async getOneByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return await this.dataSource.query(
      `
      SELECT "Id", "IsConfirmed", "Login" 
      FROM public."Users"
      WHERE "Login" = $1
        OR "Email" = $1;
      `,
      [loginOrEmail],
    );
  }

  async getOneUserById(id: string): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT * 
      FROM public."Users"
      WHERE "Id" = $1;
      `,
      [id],
    );
  }

  async getOneByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT User."Id" as Id, "IsConfirmed", "ConfirmationCode", "ExpirationDate"
      FROM public."EmailConfirmationForUsers" as Email
          LEFT JOIN public."Users" as Users ON "ConfirmationCode" = $1
      WHERE Users."Id" = Email."UserId";
      `,
      [confirmationCode],
    );
  }

  async getOneByPassCode(code: string): Promise<UserDocument | null> {
    return this.dataSource.query(
      `
      SELECT User."Id" as Id, "RecoveryCode", "ExpirationDate"
      FROM public."PasswordRecoveryForUsers" as Pass
          LEFT JOIN public."Users" as Users ON "RecoveryCode" = $1
      WHERE Users."Id" = Pass."UserId";
      `,
      [code],
    );
  }

  async getConfirmationCodeByUserId(id: string) {
    return await this.dataSource.query(
      `
      SELECT "ConfirmationCode" AS code
      FROM public."EmailConfirmationForUsers"
      WHERE
        "UserId" = $1;  
      `,
      [id],
    );
  }
}
