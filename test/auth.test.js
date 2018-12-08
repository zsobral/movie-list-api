'use strict';

const request = require('supertest');
const cookieParser = require('cookie-parser');

const db = require('../src/db');
const app = require('../src/app');
const User = require('../src/models/user');
const Token = require('../src/models/token');

const user = {
  name: 'mateus',
  email: 'mateus@gmail.com',
  password: '123456'
};
let cookies;

beforeAll(async () => {
  await db.connect();
  const newUser = await new User(user).save();
  user.id = newUser.id;
});

afterAll(async () => {
  await User.remove({});
  await Token.remove({});
});

describe('POST /auth/email', () => {
  describe('valid user login', () => {
    it('should response with a signed cookie', async () => {
      const response = await request(app)
        .post('/auth/email')
        .send({
          email: user.email,
          password: user.password
        });

      const parsedCookie = decodeURIComponent(
        /[^(token=)][^;]*/.exec(response.header['set-cookie'][0])[0]
      );
      cookies = response.header['set-cookie'];
      const signedResult = cookieParser.signedCookie(
        parsedCookie,
        process.env.COOKIE_SECRET
      );
      expect(signedResult).toBe((await Token.findOne()).id);
      expect(response.status).toBe(200);
    });
  });

  describe('invalid user email format', () => {
    it('should response with validation error', async () => {
      const response = await request(app)
        .post('/auth/email')
        .send({
          email: 'randomemail',
          password: user.password
        });

      expect(response.body.error.code).toBe('VALIDATION_ERR');
      expect(response.status).toBe(400);
    });
  });

  describe('empty body', () => {
    it('should response with validation error', async () => {
      const response = await request(app).post('/auth/email');

      expect(response.body.error.code).toBe('VALIDATION_ERR');
      expect(response.status).toBe(400);
    });
  });

  describe('invalid password', () => {
    it('should response with validation error', async () => {
      const response = await request(app)
        .post('/auth/email')
        .send({
          email: user.email,
          password: 'wrongpassword'
        });

      expect(response.body.error.code).toBe('UNAUTHORIZED_ERR');
      expect(response.status).toBe(401);
    });
  });
});

describe('DELETE /logout', () => {
  it('should remove the token', async () => {
    const response = await request(app)
      .delete('/logout')
      .set('Cookie', cookies);

    expect(await Token.count()).toBe(0);
    expect(response.status).toBe(200);
  });
});
