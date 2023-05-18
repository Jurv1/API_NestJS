import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentRefreshToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.cookies.refreshToken;
  },
);
