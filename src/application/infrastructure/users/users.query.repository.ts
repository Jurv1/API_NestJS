import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/users/user.entity';
import { EmailConfirmationForUsers } from '../../entities/users/email.confirmation.for.users.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(EmailConfirmationForUsers)
    private readonly emailRepo: Repository<EmailConfirmationForUsers>,
  ) {}
  async getAllUsersForAdmin(
    filter: { [key: string]: string | boolean },
    sort: { [key: string]: 'ASC' | 'DESC' },
    pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    },
  ): Promise<User[]> {
    return await this.usersRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.bansForUserByAdmin', 'b')
      .where('(u.login ILIKE :login OR u.email ILIKE :email)')
      .andWhere('u.isBanned = :ban1 OR u.isBanned = :ban2')
      .orderBy(`u.${Object.keys(sort)[0]}`, `${Object.values(sort)[0]}`)
      .skip(pagination.skipValue)
      .take(pagination.limitValue)
      .setParameters({
        login: filter['loginTerm'],
        email: filter['emailTerm'],
        ban1: filter['banCond'],
        ban2: filter['banCond1'],
      })
      .getMany();

    // return await this.dataSource.query(
    //   `
    //   SELECT
    //     Users."id",
    //     Users."login",
    //     Users."email",
    //     Users."createdAt",
    //     Users."isBanned",
    //     Bans."banDate",
    //     Bans."banReason"
    //   FROM public."user" AS Users
    //   LEFT JOIN public."bans_for_user_by_admin" AS Bans
    //    ON Bans."userId" = Users."id"
    //   WHERE ("login" ILIKE $1 OR "email" ILIKE $2)
    //     AND ("isBanned" = $3 OR "isBanned" = $4)
    //   ORDER BY "${Object.keys(sort)[0]}" ${Object.values(sort)[0]}
    //   LIMIT ${pagination.limitValue} OFFSET ${pagination.skipValue};
    //   `,
    //   [
    //     filter['loginTerm'],
    //     filter['emailTerm'],
    //     filter['banCond'],
    //     filter['banCond1'],
    //   ],
    // );
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

  async getOneUserByLogin(login: string): Promise<User | null> {
    return await this.usersRepo.findOneBy({ login: login });
  }

  async getOneByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return await this.usersRepo.findOneBy([
      { login: loginOrEmail },
      { email: loginOrEmail },
    ]);
  }

  async getOneUserById(id: string): Promise<User | null> {
    return await this.usersRepo.findOneBy({ id: +id });
  }

  async getOneByConfirmationCode(
    confirmationCode: string,
  ): Promise<User | null> {
    return this.usersRepo.findOne({
      relations: {
        emailConfirmationForUsers: true,
      },
      where: {
        emailConfirmationForUsers: {
          confirmationCode: confirmationCode,
        },
      },
    });

    // return this.dataSource.query(
    //   `
    //   SELECT Users."id", "isConfirmed", "confirmationCode", "expirationDate"
    //   FROM public."email_confirmation_for_users" AS Email
    //       LEFT JOIN public."user" AS Users ON "confirmationCode" = $1
    //   WHERE Users."id" = Email."userId";
    //   `,
    //   [confirmationCode],
    // );
  }

  async getOneByPassCode(code: string): Promise<User | null> {
    return this.usersRepo.findOne({
      relations: {
        passwordRecoveryForUsers: true,
      },
      where: {
        passwordRecoveryForUsers: {
          recoveryCode: code,
        },
      },
    });

    // return this.dataSource.query(
    //   `
    //   SELECT Users."id", "recoveryCode", "expirationDate"
    //   FROM public."password_recovery_for_users" AS Pass
    //       LEFT JOIN public."user" AS Users ON "RecoveryCode" = $1
    //   WHERE Users."id" = Pass."userId";
    //   `,
    //   [code],
    // );
  }

  async getConfirmationCodeByUserId(id: number) {
    return await this.emailRepo
      .createQueryBuilder('e')
      .where(`e."userId" = :id`)
      .setParameters({ id: id })
      .getOne();

    // return await this.dataSource.query(
    //   `
    //   SELECT "confirmationCode" AS code
    //   FROM public."email_confirmation_for_users"
    //   WHERE
    //     "userId" = $1;
    //   `,
    //   [id],
    // );
  }
}
