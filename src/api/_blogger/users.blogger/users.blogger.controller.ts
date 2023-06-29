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
import { filterForUsersByBlogger } from '../../../application/utils/filters/filter.for.users.by.blogger';
import { ultimateSort } from '../../../application/utils/sorts/ultimate.sort';
import { EnumForUserByAdminSorting } from '../../../application/enums/enum.for.user.by.admin.sorting';
import { makePagination } from '../../../application/utils/make.paggination';

@Controller('blogger/users')
export class UsersBloggerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('blog/:id')
  async getAllBannedUsersForBlog(
    @Query() query: QueryForBannedUsers,
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    const filter = filterForUsersByBlogger(query.searchLoginTerm);
    const sort = ultimateSort(
      query.sortBy,
      query.sortDirection,
      EnumForUserByAdminSorting,
    );
    const pagination = makePagination(query.pageNumber, query.pageSize);

    return await this.queryBus.execute(
      new GetAllBannedUsersByBlogIdCommand(
        filter,
        sort,
        pagination,
        userId,
        id,
      ),
    );
  }

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
