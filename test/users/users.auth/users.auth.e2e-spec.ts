import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { createAndGetApp } from '../../utils/create.and.get.app';
import { testingUrl } from '../../constants/url-constants/testing/testing.url-constants';
import { baseSAUserUrl } from '../../constants/url-constants/super-admin/users/super-admin.users-url';
import {
  superAdminLogin,
  superAdminPassword,
} from '../../constants/auth/logins-passwords';
import { userObjectBuilder } from '../../objects/users.objects/user.object.builder';
import {
  validUserLogin,
  validUserLogin2,
} from '../../constants/data-constants/users-data/users-logins';
import { validPassword } from '../../constants/data-constants/users-data/users-passwords';
import {
  validUserEmail,
  validUserEmail2,
} from '../../constants/data-constants/users-data/users-emails';
import {
  secondUserCreatedObject,
  userCreatedObject,
} from '../../objects/users.objects/user.object';
import { publicAuthUrl } from '../../constants/url-constants/public/public.auth-url';
import { v4 as uuidv4 } from 'uuid';

describe('Testing login, logout and devices operations', () => {
  describe('Testing 401 on login', () => {
    let app: INestApplication;
    let agent: SuperAgentTest;

    beforeAll(async () => {
      const appAgentObj = await createAndGetApp();
      app = appAgentObj.app;
      agent = appAgentObj.agent;
      agent.delete(testingUrl).expect(204);
    });

    it('should create two users', async function () {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, validPassword, validUserEmail))
        .expect(201);

      expect(request.body).toEqual(userCreatedObject);

      const request2 = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin2, validPassword, validUserEmail2))
        .expect(201);

      expect(request2.body).toEqual(secondUserCreatedObject);
    });

    it('should 401 on trying to login with wrong creds', async function () {
      await agent
        .post(publicAuthUrl)
        .send({ loginOrEmail: validUserLogin2, password: uuidv4() })
        .expect(401);

      await agent
        .post(publicAuthUrl)
        .send({ loginOrEmail: uuidv4(), password: validPassword })
        .expect(401);
    });
  });
});
