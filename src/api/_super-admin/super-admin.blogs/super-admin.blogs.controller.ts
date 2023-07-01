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
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogToUserCommand } from './use-cases/bind.blog.to.user.use-case';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { BlogWithPaginationDto } from '../../../application/dto/blogs/dto/view/blog.with.pagination.dto';
import { BlogMapper } from '../../../application/utils/mappers/blog.mapper';
import { BlogBanBody } from '../../../application/dto/blogs/dto/body/blog.ban.body';
import { BanUnbanBlogByIdCommand } from './use-cases/ban.unban.blog.by.id.use-case';
import { BlogsQueryRepository } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { ultimateSort } from '../../../application/utils/sorts/ultimate.sort';
import { EnumForBlogs } from '../../../application/enums/emun.for.blogs';
import { filterForPublicBlogs } from '../../../application/utils/filters/filter.for.public.blogs';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogQ: BlogsQueryRepository,
    private readonly blogMapper: BlogMapper,
  ) {}
  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(@Query() query?: BlogQueryParams) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = filterForPublicBlogs(searchNameTerm);
    const sort = ultimateSort(sortBy, sortDirection, EnumForBlogs);
    const pagination = makePagination(pageNumber, pageSize);

    try {
      const result: any = await this.blogQ.getAllBlogs(
        filter,
        sort,
        pagination,
      );
      const mappedBlogs = await this.blogMapper.mapBlogsForAdmin(result);
      return mappedBlogs;
      result.items = await this.blogMapper.mapBlogsForAdmin(result.items);
      return result;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
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
