import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest();
      const accessTokenIndex = request.rawHeaders.indexOf('Authorization') + 1;
      const accessToken = request.rawHeaders[accessTokenIndex];
      return accessToken.replace('Bearer ', '');
    } catch (err) {
      console.log(err);
    }
  },
);
