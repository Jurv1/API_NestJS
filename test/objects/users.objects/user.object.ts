import { UserViewDto } from '../../../src/application/dto/users/dto/user.view.dto';
import {
  validUserLogin,
  validUserLogin2,
} from '../../constants/data-constants/users-data/users-logins';
import {
  validUserEmail,
  validUserEmail2,
} from '../../constants/data-constants/users-data/users-emails';

export const userCreatedObject: UserViewDto = {
  id: expect.any(String),
  login: validUserLogin,
  email: validUserEmail,
  createdAt: expect.any(String),
  banInfo: {
    isBanned: false,
    banReason: null,
    banDate: null,
  },
};

export const secondUserCreatedObject: UserViewDto = {
  id: expect.any(String),
  login: validUserLogin2,
  email: validUserEmail2,
  createdAt: expect.any(String),
  banInfo: {
    isBanned: false,
    banReason: null,
    banDate: null,
  },
};
