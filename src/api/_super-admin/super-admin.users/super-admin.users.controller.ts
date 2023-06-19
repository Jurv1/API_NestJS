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
import { UserQ } from '../../../application/infrastructure/users/_MongoDB/users.query.repository';
import { AdminAuthGuard } from '../../_public/auth/guards/admin-auth.guard';
import { UserQuery } from '../../../application/dto/users/dto/user.query';
import { FilterQuery, SortOrder } from 'mongoose';
import { UserDocument } from '../../../application/schemas/users/schemas/users.database.schema';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { UserBody } from '../../../application/dto/users/dto/user.body';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './use-cases/create.user.use-case';
import { UserWithPaginationDto } from '../../../application/dto/users/dto/user.with.pagination.dto';
import { UserMapper } from '../../../application/utils/mappers/user.mapper';
import { DeleteUserBySuperAdminCommand } from './use-cases/delete.user.by.super.admin.use-case';
import { BanBody } from '../../../application/dto/users/dto/ban.body';
import { BanUnbanUserBySuperAdminCommand } from './use-cases/ban.unban.user.by.super.admin.use-case';
import { filterForUsersSuperAdmin } from '../../../application/utils/filters/filter.for.users.super-admin';

@Controller('sa/users')
export class SuperAdminUsersController {
  constructor(
    protected userQ: UserQ,
    private readonly commandBus: CommandBus,
    private readonly userMapper: UserMapper,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(@Query() query: UserQuery) {
    let {
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

    if (typeof sortBy === 'undefined') {
      sortBy = 'createdAt';
    }
    const filter: FilterQuery<UserDocument> = filterForUsersSuperAdmin(
      banStatus,
      searchLoginTerm,
      searchEmailTerm,
    );

    const sortingObj: { [key: string]: SortOrder } = {
      [`accountData.${sortBy}`]: 'desc',
    };

    if (sortDirection === 'asc') {
      sortingObj[`accountData.${sortBy}`] = 'asc';
    }
    const pagination = makePagination(pageNumber, pageSize);

    try {
      const allUsers: UserWithPaginationDto = await this.userQ.getAllUsers(
        filter,
        sortingObj,
        pagination,
      );

      if (!allUsers) {
        return new Errors.NOT_FOUND();
      }

      allUsers.items = this.userMapper.mapUsers(allUsers.items);

      return allUsers;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
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
