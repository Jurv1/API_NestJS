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
import { UsersService } from '../../../users/users.service';
import { UserQ } from '../../../users/users.query.repository';
import { AdminAuthGuard } from '../../public/auth/guards/admin-auth.guard';
import { UserQuery } from '../../../users/dto/user.query';
import { FilterQuery, SortOrder } from 'mongoose';
import { UserDocument } from '../../../users/schemas/users.database.schema';
import { makePagination } from '../../../utils/make.paggination';
import { Errors } from '../../../utils/handle.error';
import { UserBody } from '../../../users/dto/user.body';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './use-cases/create.user.use-case';
import { UserViewDto } from '../../../users/dto/user.view.dto';
import { UserWithPaginationDto } from '../../../users/dto/user.with.pagination.dto';
import { UserMapper } from '../../../utils/mappers/user.mapper';
import { DeleteUserBySuperAdminCommand } from './use-cases/delete.user.by.super.admin.use-case';
import { BanBody } from '../../../users/dto/ban.body';
import { BanUserBySuperAdminCommand } from './use-cases/ban.user.by.super.admin.use-case';

@Controller('sa/users')
export class SuperAdminUsersController {
  constructor(
    protected userService: UsersService,
    protected userQ: UserQ,
    private readonly commandBus: CommandBus,
    private readonly userMapper: UserMapper,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(@Query() query: UserQuery) {
    let {
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
    const filter: FilterQuery<UserDocument> = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];

      if (searchLoginTerm) {
        filter.$or.push({
          'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
        });
      }

      if (searchEmailTerm) {
        filter.$or.push({
          'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
        });
      }
    }

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
      new BanUserBySuperAdminCommand(id, body),
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
