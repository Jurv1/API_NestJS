import { createAndGetApp } from '../../utils/create.and.get.app';
import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { testingUrl } from '../../constants/url-constants/testing/testing.url-constants';
import {
  banUserUrl,
  baseSAUserUrl,
} from '../../constants/url-constants/super-admin/users/super-admin.users-url';
import {
  superAdminFakeLoginPassword,
  superAdminLogin,
  superAdminPassword,
} from '../../constants/auth/logins-passwords';
import { makeException } from '../../objects/exceptions/make.exception';
import {
  banReasonField,
  emailField,
  isBannedField,
  loginField,
  passwordField,
} from '../../objects/exceptions/fields';
import { userObjectBuilder } from '../../objects/users.objects/user.object.builder';
import {
  intPassword,
  longPassword,
  validPassword,
} from '../../constants/data-constants/users-data/users-passwords';
import {
  invalidEmail,
  validUserEmail,
  validUserEmail2,
} from '../../constants/data-constants/users-data/users-emails';
import {
  IntLogin,
  longLogin,
  validUserLogin,
  validUserLogin2,
} from '../../constants/data-constants/users-data/users-logins';
import { userCreatedObject } from '../../objects/users.objects/user.object';
import { banUserObjectBuilder } from '../../objects/users.objects/ban.user.object.builder';
import {
  invalidIsBanned,
  invalidTypeForBanReason,
  shortBanReason,
  validBanReason,
  validIsBannedFalse,
  validIsBannedTrue,
} from '../../constants/data-constants/users-data/ban.body.data';
import {
  bannedUserBanInfo,
  unbannedUserBanInfo,
} from '../../objects/users.objects/ban.users.objs';

describe('Testing operations with users by super-admin', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeAll(async () => {
    const appAgentObj = await createAndGetApp();
    app = appAgentObj.app;
    agent = appAgentObj.agent;
    agent.delete(testingUrl).expect(204);
  });

  describe('400 operations with users by super-admin', () => {
    it('should not create a user without login', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder('', validPassword, validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(loginField));
    });

    it('should not create user without password', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, '', validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(passwordField));
    });

    it('should not create a user without email', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, validPassword, ''))
        .expect(400);

      expect(request.body).toEqual(makeException(emailField));
    });

    it('should not create a user with long login', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(longLogin, validPassword, validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(loginField));
    });

    it('should not create a user with long password', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, longPassword, validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(passwordField));
    });

    it('should not create a user with invalid email', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, validUserLogin, invalidEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(emailField));
    });

    it('should not create a user with login wrong type', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(IntLogin, validPassword, validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(loginField));
    });

    it('should not create a user with password wrong type', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, intPassword, validUserEmail))
        .expect(400);

      expect(request.body).toEqual(makeException(passwordField));
    });
  });

  describe('401', () => {
    it('should not let create user with wrong login', async () => {
      await agent
        .post(baseSAUserUrl)
        .auth(superAdminFakeLoginPassword, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, intPassword, validUserEmail))
        .expect(401);
    });

    it('should not let create user with wrong password', async () => {
      await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminFakeLoginPassword)
        .set(userObjectBuilder(validUserLogin, intPassword, validUserEmail))
        .expect(401);
    });
  });

  describe(
    'successful user creation and checking 400 for trying to' +
      ' create a user with existing login/email',
    () => {
      it('should create a user', async () => {
        const request = await agent
          .post(baseSAUserUrl)
          .auth(superAdminLogin, superAdminPassword)
          .set(userObjectBuilder(validUserLogin, validPassword, validUserEmail))
          .expect(201);

        expect(request.body).toEqual(userCreatedObject);
      });

      it('should not create a user with same login', async () => {
        const request = await agent
          .post(baseSAUserUrl)
          .auth(superAdminLogin, superAdminPassword)
          .set(
            userObjectBuilder(validUserLogin, validPassword, validUserEmail2),
          )
          .expect(400);

        expect(request.body).toEqual(makeException(loginField));
      });

      it('should not create a user with same login', async () => {
        const request = await agent
          .post(baseSAUserUrl)
          .auth(superAdminLogin, superAdminPassword)
          .set(
            userObjectBuilder(validUserLogin2, validPassword, validUserEmail),
          )
          .expect(400);

        expect(request.body).toEqual(makeException(emailField));
      });
    },
  );

  describe('get/delete methods + ban user', () => {
    it('should get one user and delete it', async () => {
      const result = await agent.get(baseSAUserUrl).expect(200);
      expect(result.body.items[0]).toEqual(userCreatedObject);

      await agent.delete(baseSAUserUrl + result.body.items[0].id).expect(204);
      const noUsers = await agent.get(baseSAUserUrl).expect(200);
      expect(noUsers.body.items.length).toEqual(0);

      await agent.delete(baseSAUserUrl + result.body.items[0].id).expect(404);
    });
  });

  describe('400 on ban user operations', () => {
    it('should create user and 400 on trying ban it with short reason', async () => {
      const request = await agent
        .post(baseSAUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(userObjectBuilder(validUserLogin, validPassword, validUserEmail))
        .expect(201);
      const banResult = await agent
        .put(baseSAUserUrl + request.body.id + banUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(banUserObjectBuilder(validIsBannedTrue, shortBanReason))
        .expect(400);
      expect(banResult.body).toEqual(makeException(banReasonField));
    });

    it('should not ban user with invalid type in banReason', async () => {
      const result = await agent.get(baseSAUserUrl).expect(200);

      const banResult = await agent
        .put(baseSAUserUrl + result.body.items[0].id + banUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(banUserObjectBuilder(validIsBannedTrue, invalidTypeForBanReason))
        .expect(400);
      expect(banResult.body).toEqual(makeException(banReasonField));
    });

    it('should not ban user with invalid type on isBanned', async () => {
      const result = await agent.get(baseSAUserUrl).expect(200);

      const banResult = await agent
        .put(baseSAUserUrl + result.body.items[0].id + banUserUrl)
        .auth(superAdminLogin, superAdminPassword)
        .set(banUserObjectBuilder(invalidIsBanned, validBanReason))
        .expect(400);
      expect(banResult.body).toEqual(makeException(isBannedField));
    });

    describe('it should ban/unban user', () => {
      it('should not ban user without creds', async () => {
        const result = await agent.get(baseSAUserUrl).expect(200);
        await agent
          .put(baseSAUserUrl + result.body.items[0].id + banUserUrl)
          .auth(superAdminFakeLoginPassword, superAdminPassword)
          .set(banUserObjectBuilder(validIsBannedTrue, validBanReason))
          .expect(401);
      });

      it('should ban user', async () => {
        const result = await agent.get(baseSAUserUrl).expect(200);
        await agent
          .put(baseSAUserUrl + result.body.items[0].id + banUserUrl)
          .auth(superAdminLogin, superAdminPassword)
          .set(banUserObjectBuilder(validIsBannedTrue, validBanReason))
          .expect(200);
        const newResult = await agent.get(baseSAUserUrl).expect(200);
        expect(newResult.body.items[0].banInfo).toEqual(bannedUserBanInfo);
      });

      it('should unban user', async () => {
        const result = await agent.get(baseSAUserUrl).expect(200);
        await agent
          .put(baseSAUserUrl + result.body.items[0].id + banUserUrl)
          .auth(superAdminLogin, superAdminPassword)
          .set(banUserObjectBuilder(validIsBannedFalse, validBanReason))
          .expect(200);
        const newResult = await agent.get(baseSAUserUrl).expect(200);
        expect(newResult.body.items[0].banInfo).toEqual(unbannedUserBanInfo);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
