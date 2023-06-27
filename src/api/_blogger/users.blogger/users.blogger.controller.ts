import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../_public/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../_public/auth/decorators/current-user.param.decorator';
import { BloggerBanDto } from '../../../application/dto/blogs/dto/blogger.ban.dto';
import { QueryForBannedUsers } from '../../../application/dto/blogs/dto/queries/query.for.banned.users';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllBannedUsersByBlogIdCommand } from './use-cases/queries/use-cases/get.all.banned.users.by.blog.id.use-case';
import { BanUnbanUserByBloggerCommand } from './use-cases/commands/ban.unban.user.by.blogger.use-case';

@Controller('blogger/users')
export class UsersBloggerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  // @UseGuards(JwtAuthGuard)
  // @Get('blog/:id')
  // async getAllBannedUsersForBlog(
  //   @Query() query: QueryForBannedUsers,
  //   @Param('id') id: string,
  //   @CurrentUserId() userId: string,
  // ) {
  //   return await this.queryBus.execute(
  //     new GetAllBannedUsersByBlogIdCommand(query, userId, id),
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banUnbanUserForBlog(
    @Param('id') id: string,
    @Body() body: BloggerBanDto,
    @CurrentUserId() userId: string,
  ) {
    return await this.commandBus.execute(
      new BanUnbanUserByBloggerCommand(id, userId, body),
    );
  }
}
