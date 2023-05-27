import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest();
      const bearer = request.rawHeaders.filter((el) => el.includes('Bearer'));
      //const accessTokenIndex = request.rawHeaders.indexOf('Authorization') + 1;
      //const accessToken = request.rawHeaders[accessTokenIndex];
      return bearer.replace('Bearer ', '');
    } catch (err) {
      console.log(err);
    }
  },
);
