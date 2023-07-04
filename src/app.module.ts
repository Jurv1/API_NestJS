//confModule should be first
import { configModule } from './application/config/config.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/_public/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './api/modules/users.module';
import { DevicesModule } from './api/modules/devices.module';
import { BlogsModule } from './api/modules/blogs.module';
import { CommentsModule } from './api/modules/comments.module';
import { LikesModule } from './api/modules/likes.module';
import {
  configForTypeOrm,
  defaultTypeOrm,
} from './application/config/config.for.type-orm';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(defaultTypeOrm),
    AuthModule,
    MailModule,
    CqrsModule,
    UsersModule,
    DevicesModule,
    BlogsModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
