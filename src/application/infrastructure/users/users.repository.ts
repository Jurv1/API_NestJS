import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BanBody } from '../../dto/users/dto/ban.body';
import { getTimeForUserBan } from '../../utils/funcs/get.time.for.user-ban';
import { User } from '../../entities/users/user.entity';
import { BansForUserByAdmin } from '../../entities/users/bans.for.user.by.admin.entity';
import { EmailConfirmationForUsers } from '../../entities/users/email.confirmation.for.users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(BansForUserByAdmin)
    private readonly bansRepo: Repository<BansForUserByAdmin>,
    @InjectRepository(EmailConfirmationForUsers)
    private readonly emailRepo: Repository<EmailConfirmationForUsers>,
  ) {}

  // async createOne(userCreationDto: UserCreationDto): Promise<User | null> {
  //   const user: User = await this.usersRepo.save(userCreationDto);
  //
  //   await this.bansRepo.save(user.id);
  //   const userId = await this.dataSource.query(
  //     `INSERT INTO public."user"
  //               ("login", "email", "password",
  //                   "passwordSalt", "isConfirmed", "isBanned", "createdAt")
  //                   VALUES ($1, $2, $3, $4, $5, $6, $7)
  //                   RETURNING "id";`,
  //     [
  //       userCreationDto.login,
  //       userCreationDto.email,
  //       userCreationDto.passwordHash,
  //       userCreationDto.passwordSalt,
  //       userCreationDto.isConfirmed,
  //       false,
  //       new Date().toISOString(),
  //     ],
  //   );
  //
  //   await this.dataSource.query(
  //     `
  //     INSERT INTO public."bans_for_user_by_admin"
  //       ("userId")
  //     VALUES ($1);
  //     `,
  //     [userId[0].Id],
  //   );
  //
  //   return await this.dataSource.query(
  //     `
  //     SELECT Users."id", Users."login", Users."email", Users."isBanned",
  //           Users."createdAt", Bans."banDate", Bans."banReason"
  //     FROM public."user" AS Users
  //     LEFT JOIN public."bans_for_user_by_admin" AS Bans
  //       ON Bans."userId" = Users."id"
  //     WHERE Users."id" = $1;
  //     `,
  //     [userId[0].Id],
  //   );
  // }

  async createBanInfoForNewUser(user: User) {
    const ban = new BansForUserByAdmin();
    ban.user = user;
    ban.banReason = null;
    ban.banDate = null;

    await this.bansRepo.save(ban);
  }

  async updateBanInfoForUser(userId: string, banBody: BanBody) {
    await this.usersRepo
      .createQueryBuilder('b')
      .update(BansForUserByAdmin)
      .set({
        banReason: banBody.banReason,
        banDate: getTimeForUserBan(banBody.isBanned),
      })
      .where('user = :id', { id: userId })
      .execute();

    await this.usersRepo
      .createQueryBuilder('u')
      .update(User)
      .set({ isBanned: banBody.isBanned })
      .where({ id: userId })
      .execute();
  }

  async updateEmailConfirmation(emailInfo: EmailConfirmationForUsers) {
    await this.emailRepo.query(
      `
      INSERT INTO public."email_confirmation_for_users"
      ("confirmationCode", "expirationDate", "userId")
        VALUES($1, $2, $3) 
      ON CONFLICT ("userId") 
      DO 
        UPDATE SET "confirmationCode" = EXCLUDED."confirmationCode",
            "expirationDate" = EXCLUDED."expirationDate";
      `,
      [emailInfo.confirmationCode, emailInfo.expirationDate, emailInfo.user.id],
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
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ isConfirmed: isConfirmed })
      .where(`id = :id`, { id: id })
      .execute();
  }

  async updatePassword(id: string, passHash: string, passSalt: string) {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ passwordHash: passHash, passwordSalt: passSalt })
      .where(`id = :id`, { id: id })
      .execute();
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.usersRepo
      .createQueryBuilder('u')
      .delete()
      .from(User)
      .where('id = :id', { id: id })
      .execute();

    return result.affected === 1;
  }
}
