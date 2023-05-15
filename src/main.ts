import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exepthions/exeption.filter';
import { myExceptionFactory } from './exepthions/exeption.factory';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: myExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3003);
}
bootstrap();
