import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { createAndGetApp } from '../../utils/create.and.get.app';
import { testingUrl } from '../../constants/url-constants/testing/testing.url-constants';

describe('Testing operations with blogs by blogger', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeAll(async () => {
    const appAgentObj = await createAndGetApp();
    app = appAgentObj.app;
    agent = appAgentObj.agent;
    agent.delete(testingUrl).expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
