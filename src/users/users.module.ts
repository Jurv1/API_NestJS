import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.database.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserQ } from './users.query.repository';
import { UsersRepository } from './users.repository';
import { MailService } from '../mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserQ, UsersRepository, MailService],
  exports: [UsersService, UserQ, UsersRepository, MailService],
})
export class UsersModule {}
