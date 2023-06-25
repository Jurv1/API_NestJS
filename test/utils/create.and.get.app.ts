import { Test } from '@nestjs/testing';
import { configForTypeOrm } from '../../src/application/config/config.for.type-orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest, { SuperAgentTest } from 'supertest';
import cookieParser from 'cookie-parser';
import { myExceptionFactory } from '../../src/application/exceptions/exception.factory';
import { HttpExceptionFilter } from '../../src/application/exceptions/exception.filter';
import { useContainer } from 'class-validator';

export async function createAndGetApp() {
  const testingModule = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(configForTypeOrm), AppModule],
  }).compile();

  const app: INestApplication = testingModule.createNestApplication();
  const agent: SuperAgentTest = supertest.agent(app.getHttpServer());

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: myExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();

  return {
    app,
    agent,
  };
}
