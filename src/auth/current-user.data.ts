import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDataDto } from './dto/user-login-data.dto';

export const CurrentUserData = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userData: UserDataDto = {
      userId: request.user.id,
      device: request.headers['user-agent'] || 'unknown device',
      deviceIp: request.ip,
    };
    return userData;
  },
);
