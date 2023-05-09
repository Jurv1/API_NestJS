import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.database.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async validateUser(login: string, password: string) {
    const user: UserDocument = await this.userService.findUserByLogin(login);

    if (user) {
      const isPasswordLegit = await bcrypt.compare(
        password,
        user.accountData.password,
      );
    }
  }

  async login(user: any) {
    //this.jwtService.sign();
  }
}
