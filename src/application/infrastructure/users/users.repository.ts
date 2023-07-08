import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserCreationDto } from '../../dto/users/dto/user.creation.dto';
import { UserDocument } from '../../schemas/users/schemas/users.database.schema';
import { BanBody } from '../../dto/users/dto/ban.body';
import { add } from 'date-fns';
import { getTimeForUserBan } from '../../utils/funcs/get.time.for.user-ban';
import { User } from '../../entities/users/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(userCreationDto: UserCreationDto): Promise<User[] | null> {
    const userId = await this.dataSource.query(
      `INSERT INTO public."user" 
                ("login", "email", "password",
                    "passwordSalt", "isConfirmed", "isBanned", "createdAt") 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING "id";`,
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
      INSERT INTO public."bans_for_user_by_admin"
        ("userId")
      VALUES ($1);
      `,
      [userId[0].Id],
    );

    return await this.dataSource.query(
      `
      SELECT Users."id", Users."login", Users."email", Users."isBanned",
            Users."createdAt", Bans."banDate", Bans."banReason"
      FROM public."user" AS Users
      LEFT JOIN public."bans_for_user_by_admin" AS Bans
        ON Bans."userId" = Users."id"
      WHERE Users."id" = $1;
      `,
      [userId[0].Id],
    );
  }

  async updateBanInfoForUser(userId: string, banBody: BanBody) {
    await this.dataSource.query(
      `
      UPDATE public."bans_for_user_by_admin"
      SET "banReason" = $1,
        "banDate" = $2
      WHERE "userId" = $3;
      `,
      [banBody.banReason, getTimeForUserBan(banBody.isBanned), userId],
    );

    await this.dataSource.query(
      `
      UPDATE public."user"
      SET "isBanned" = $1
      WHERE "id" = $2;
      `,
      [banBody.isBanned, userId],
    );
  }

  async updateEmailConfirmation(id: string, code: string) {
    await this.dataSource.query(
      `
      INSERT INTO public."email_confirmation_for_users" (
        "confirmationCode",
        "expirationDate",
        "userId")
      VALUES($1, $2, $3) 
      ON CONFLICT ("userId") 
      DO 
        UPDATE SET "confirmationCode" = EXCLUDED."confirmationCode",
            "expirationDate" = EXCLUDED."expirationDate";
      `,
      [code, add(new Date(), { hours: 1, minutes: 3 }), id],
    );
  }

  async updatePasswordConfirmation(id: string, code: string, date: Date) {
    await this.dataSource.query(
      `
      INSERT INTO public."password_recovery_for_users" (
        "recoveryCode",
        "expirationDate",
        "userId")
      VALUES($1, $2, $3) 
      ON CONFLICT ("userId") 
      DO 
        UPDATE SET "recoveryCode" = EXCLUDED."recoveryCode",
            "expirationDate" = EXCLUDED."expirationDate";
      `,
      [code, date, id],
    );
  }

  async updateConfirmationInUsers(id: string, isConfirmed: boolean) {
    await this.dataSource.query(
      `
      UPDATE public."user"
        SET "isConfirmed" = $1
      WHERE "id" = $2;
      `,
      [isConfirmed, id],
    );
  }

  async updatePassword(id: string, passHash: string, passSalt: string) {
    await this.dataSource.query(
      `
      UPDATE public."user"
        SET "password" = $1, "passwordSalt" = $2
      WHERE "id" = $3;
      `,
      [passHash, passSalt, id],
    );
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
            DELETE FROM public."user"
            WHERE "id" = $1;
            `,
      [id],
    );
    return result[1] === 1;
  }
}
