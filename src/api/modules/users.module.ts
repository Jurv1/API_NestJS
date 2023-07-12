import { Module } from '@nestjs/common';
import { SuperAdminUsersController } from '../_super-admin/super-admin.users/super-admin.users.controller';
import { allUsersUseCases } from './use-cases/all.users.use-cases';
import { allReposForUserModule } from './repositories/all.repos.for.user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserMapper } from '../../application/utils/mappers/user.mapper';
import { UsersService } from '../../application/infrastructure/users/users.service';
import { MailService } from '../../mail/mail.service';
import { UsersBloggerController } from '../_blogger/users.blogger/users.blogger.controller';
import { allUserBloggerUseCases } from './use-cases/blogger/all.user-blogger.use-cases';
import { BlogsRepository } from '../../application/infrastructure/blogs/blogs.repository';
import { BlogsQueryRepository } from '../../application/infrastructure/blogs/blogs.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../application/entities/users/user.entity';
import { BannedUsersByBlogger } from '../../application/entities/users/banned.users.by.blogger.entity';
import { BansForUserByAdmin } from '../../application/entities/users/bans.for.user.by.admin.entity';
import { EmailConfirmationForUsers } from '../../application/entities/users/email.confirmation.for.users.entity';
import { PasswordRecoveryForUsers } from '../../application/entities/users/password.recovery.for.users.entity';
import { Device } from '../../application/entities/devices/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BannedUsersByBlogger,
      BansForUserByAdmin,
      EmailConfirmationForUsers,
      PasswordRecoveryForUsers,
      Device,
    ]),
    CqrsModule,
  ],
  controllers: [SuperAdminUsersController, UsersBloggerController],
  providers: [
    ...allUsersUseCases,
    ...allReposForUserModule,
    ...allUserBloggerUseCases,
    UserMapper,
    BlogsQueryRepository,
    BlogsRepository,
    UsersService,
    MailService,
  ],
})
export class UsersModule {}
