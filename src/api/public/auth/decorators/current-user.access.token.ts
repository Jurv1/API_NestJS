import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest();
      return request.headers.authorization.split(' ')[1];
    } catch (err) {
      console.log(err);
    }
  },
);
