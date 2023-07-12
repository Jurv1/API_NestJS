import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../_public/auth/guards/admin-auth.guard';
import { UserQuery } from '../../../application/dto/users/dto/user.query';
import { makePagination } from '../../../application/utils/make.paggination';
import { UserBody } from '../../../application/dto/users/dto/user.body';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './use-cases/command.use-cases/create.user.use-case';
import { DeleteUserBySuperAdminCommand } from './use-cases/command.use-cases/delete.user.by.super.admin.use-case';
import { BanBody } from '../../../application/dto/users/dto/ban.body';
import { BanUnbanUserBySuperAdminCommand } from './use-cases/command.use-cases/ban.unban.user.by.super.admin.use-case';
import { sortingForUsersByAdmin } from '../../../application/utils/sorts/sorting.for.users.by.admin';
import { filterForUsersByAdmin } from '../../../application/utils/filters/filter.for.users.by.admin';
import { GetAllUsersByAdminQueryCommand } from './use-cases/query-command.use-cases/get.all.users.by.admin.use-case';

@Controller('sa/users')
export class SuperAdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(@Query() query: UserQuery) {
    const {
      // eslint-disable-next-line prefer-const
      banStatus,
      // eslint-disable-next-line prefer-const
      searchLoginTerm,
      // eslint-disable-next-line prefer-const
      searchEmailTerm,
      sortBy,
      // eslint-disable-next-line prefer-const
      sortDirection,
      // eslint-disable-next-line prefer-const
      pageNumber,
      // eslint-disable-next-line prefer-const
      pageSize,
    } = query;
    const filter: { [key: string]: string | boolean } = filterForUsersByAdmin(
      banStatus,
      searchLoginTerm,
      searchEmailTerm,
    );
    const pagination: {
      skipValue: number;
      limitValue: number;
      pageSize: number;
      pageNumber: number;
    } = makePagination(pageNumber, pageSize);
    const sortingObj: { [key: string]: 'ASC' | 'DESC' } =
      sortingForUsersByAdmin(sortBy, sortDirection);
    return await this.queryBus.execute(
      new GetAllUsersByAdminQueryCommand(filter, pagination, sortingObj),
    );
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id/ban')
  async banUser(@Param('id') id: string, @Body() body: BanBody) {
    return await this.commandBus.execute(
      new BanUnbanUserBySuperAdminCommand(id, body),
    );
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  async createOne(@Body() body: UserBody) {
    const { login, email, password } = body;
    return await this.commandBus.execute(
      new CreateUserCommand(login, email, password, true),
    );
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteUserBySuperAdminCommand(id));
  }
}
