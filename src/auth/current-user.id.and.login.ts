import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserIdAndLogin } from './dto/user-id.and.login';

export const CurrentUserIdAndLogin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userData: UserIdAndLogin = {
      userId: request.user.userId,
      userLogin: request.user.username,
    };
    return userData;
  },
);
