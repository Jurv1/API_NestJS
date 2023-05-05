import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQ } from './users.query.repository';
import { queryValidator } from '../utils/sorting.func';
import { filterQueryValid } from '../utils/query.validator';
import { makePagination } from '../utils/make.paggination';
import { Errors } from '../utils/handle.error';
import { UserBody } from './dto/user.body';
import { UserQuery } from './dto/user.query';
import { FilterQuery, SortOrder } from 'mongoose';
import { UserDocument } from './schemas/users.database.schema';

@Controller('users')
export class UsersController {
  constructor(protected userService: UsersService, protected userQ: UserQ) {}

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

    //const sort = queryValidator(sorting, sortDirection);
    // const filter = filterQueryValid(
    //   undefined,
    //   searchLoginTerm,
    //   searchEmailTerm,
    // );
    const pagination = makePagination(pageNumber, pageSize);

    try {
      console.log(filter, sortingObj, pagination);
      const allUsers = await this.userQ.getAllUsers(
        filter,
        sortingObj,
        pagination,
      );

      if (!allUsers) {
        return new Errors.NOT_FOUND();
      }

      return allUsers;
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @Post()
  async createOne(@Body() body: UserBody) {
    const { login, email, password } = body;
    try {
      const result = await this.userService.createOneUser(
        login,
        email,
        password,
        true,
      );
      if (result) {
        return {
          id: result._id.toString(),
          login: result.accountData.login,
          email: result.accountData.email,
          createdAt: result.accountData.createdAt,
        };
      }
      return new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteOne(@Param() id) {
    try {
      const result = await this.userService.deleteOneUser(id.id);
      if (result) return;
      throw new Errors.NOT_FOUND();
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
