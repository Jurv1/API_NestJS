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
import { AdminAuthGuard } from '../../_public/auth/guards/admin-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BindBlogToUserCommand } from './use-cases/command.use-cases/bind.blog.to.user.use-case';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { makePagination } from '../../../application/utils/make.paggination';
import { BlogBanBody } from '../../../application/dto/blogs/dto/body/blog.ban.body';
import { BanUnbanBlogByIdCommand } from './use-cases/command.use-cases/ban.unban.blog.by.id.use-case';
import { ultimateSort } from '../../../application/utils/sorts/ultimate.sort';
import { EnumForBlogs } from '../../../application/enums/emun.for.blogs';
import { filterForPublicBlogs } from '../../../application/utils/filters/filter.for.public.blogs';
import { GetAllBlogsForAdminQueryCommand } from './use-cases/query.use-cases/get.all.blogs.for.admin.query.use-case';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(@Query() query?: BlogQueryParams) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = filterForPublicBlogs(searchNameTerm);
    const sort = ultimateSort(sortBy, sortDirection, EnumForBlogs);
    const pagination = makePagination(pageNumber, pageSize);

    return this.queryBus.execute(
      new GetAllBlogsForAdminQueryCommand(filter, sort, pagination),
    );
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id/bind-with-user/:userId')
  async bindBlogToUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.commandBus.execute(new BindBlogToUserCommand(id, userId));
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banUnbanBlog(@Param('id') id: string, @Body() body: BlogBanBody) {
    return await this.commandBus.execute(
      new BanUnbanBlogByIdCommand(id, body.isBanned),
    );
  }
}
