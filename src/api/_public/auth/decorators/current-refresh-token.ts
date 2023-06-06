import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';

export const CurrentRefreshToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest();
      return request.cookies.refreshToken;
    } catch (err) {
      console.log(err);
    }
  },
);
