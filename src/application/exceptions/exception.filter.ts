import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errorResponseType } from './types/error.response';

// @Catch(Error)
// export class ErrorExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//
//     if (status === 400 || status === 404) {
//       const errorsResponse = {
//         errorsMessages: [],
//       };
//
//       const responseBody: any = exception.getResponse();
//
//       if (responseBody.errorsMessages) {
//         responseBody.errorsMessages.map((el) => {
//           errorsResponse.errorsMessages.push(el);
//         });
//       } else if (responseBody.message) {
//         responseBody.message.map((el) => {
//           errorsResponse.errorsMessages.push(el);
//         });
//       }
//
//       response.status(status).json(errorsResponse);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//
//     if (status === 400 || status === 404) {
//       const errorsResponse = {
//         errorsMessages: [],
//       };
//
//       if (status === 404) {
//         response.status(404).json({
//           errorsMessages: [
//             {
//               message: 'No such blog',
//               field: 'blogId',
//             },
//           ],
//         });
//         return;
//       }
//
//       const responseBody: any = exception.getResponse();
//
//       if (responseBody.errorsMessages) {
//         responseBody.errorsMessages.map((el) => {
//           errorsResponse.errorsMessages.push(el);
//         });
//       } else if (responseBody.message) {
//         responseBody.message.map((el) => {
//           errorsResponse.errorsMessages.push(el);
//         });
//       }
//
//       response.status(status).json(errorsResponse);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND) {
      const errorsResponse: errorResponseType = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();

      if (typeof responseBody.message !== 'string') {
        responseBody.message.forEach((m) =>
          errorsResponse.errorsMessages.push(m),
        );
        response.status(status).json(errorsResponse);
      } else {
        response.status(status).json(responseBody.message);
      }
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
