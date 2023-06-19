import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserCreationDto } from '../../dto/users/dto/user.creation.dto';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { BanBody } from '../../dto/users/dto/ban.body';
import { add } from 'date-fns';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(
    userCreationDto: UserCreationDto,
  ): Promise<UserDocument | null> {
    const userId = await this.dataSource.query(
      `INSERT INTO public."Users" 
                ("Login", "Email", "Password",
                    "PasswordSalt", "IsConfirmed", "IsBanned", "CreatedAt") 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING "Id";`,
      [
        userCreationDto.login,
        userCreationDto.email,
        userCreationDto.passwordHash,
        userCreationDto.passwordSalt,
        userCreationDto.isConfirmed,
        false,
        new Date().toISOString(),
      ],
    );

    await this.dataSource.query(
      `
      INSERT INTO public."BansForUsersByAdmin"
        ("UserId")
      VALUES ($1);
      `,
      [userId[0].Id],
    );

    return await this.dataSource.query(
      `
      SELECT Users."Id", Users."Login", Users."Email", Users."IsBanned",
            Users."CreatedAt", Bans."BanDate", Bans."BanReason"
      FROM public."Users" as Users
      LEFT JOIN public."BansForUsersByAdmin" as Bans
        ON Bans."UserId" = Users."Id"
      WHERE Users."Id" = $1;
      `,
      [userId[0].Id],
    );
  }

  async updateBanInfoForUser(userId: string, banBody: BanBody) {
    await this.dataSource.query(
      `
      UPDATE public."BansForUsersByAdmin"
      SET "BanReason" = $1,
        "BanDate" = $2
      WHERE "UserId" = $3;
      `,
      [banBody.banReason, new Date().toISOString(), userId],
    );

    await this.dataSource.query(
      `
      UPDATE public."Users"
      SET "IsBanned" = $1
      WHERE "Id" = $2;
      `,
      [banBody.isBanned, userId],
    );
  }

  async updateEmailConfirmation(id: string, code: string) {
    await this.dataSource.query(
      `
      INSERT INTO public."EmailConfirmationForUsers" ("ConfirmationCode", "ExpirationDate", "UserId")
        VALUES($1, $2, $3) 
      ON CONFLICT ("UserId") 
      DO 
        UPDATE SET "ConfirmationCode" = EXCLUDED."ConfirmationCode",
            "ExpirationDate" = EXCLUDED."ExpirationDate";
      `,
      [code, add(new Date(), { hours: 1, minutes: 3 }), id],
    );
  }

  async updatePasswordConfirmation(id: string, code: string, date: Date) {
    await this.dataSource.query(
      `
      INSERT INTO public."PasswordRecoveryForUsers" ("RecoveryCode", "ExpirationDate", "UserId")
        VALUES($1, $2, $3) 
      ON CONFLICT ("UserId") 
      DO 
        UPDATE SET "ConfirmationCode" = EXCLUDED."RecoveryCode",
            "ExpirationDate" = EXCLUDED."ExpirationDate";
      `,
      [code, date, id],
    );
  }

  async updateConfirmationInUsers(id: string, isConfirmed: boolean) {
    await this.dataSource.query(
      `
      UPDATE public."Users"
        SET "IsConfirmed" = $1
      WHERE "Id" = $2;
      `,
      [isConfirmed, id],
    );
  }

  async updatePassword(id: string, passHash: string, passSalt: string) {
    await this.dataSource.query(
      `
      UPDATE public."Users"
        SET "PasswordHash" = $1, "PasswordSalt" = $2
      WHERE "Id" = $3;
      `,
      [passHash, passSalt, id],
    );
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
            DELETE FROM public."Users"
            WHERE "Id" = $1;
            `,
      [id],
    );
    return result[1] === 1;
  }
}
