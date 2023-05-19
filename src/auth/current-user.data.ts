import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserLoginDataDto } from './dto/user-login-data.dto';

export const CurrentUserData = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest();
      const userData: UserLoginDataDto = {
        userId: request.user.id,
        device: request.headers['user-agent'] || 'unknown device',
        deviceIp: request.ip,
      };
      return userData;
    } catch (err) {
      console.log(err);
    }
  },
);
