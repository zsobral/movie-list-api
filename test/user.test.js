'use strict';

const request = require('supertest');

const db = require('../src/db');
const app = require('../src/app');
const User = require('../src/models/user');

const user = {
  name: 'mateus',
  email: 'mateus@gmail.com',
  password: '123456'
};

beforeAll(async () => {
  await db.connect();

  const newUser = await new User(user).save();
  user.id = newUser.id;
});

afterAll(async () => {
  await User.findByIdAndRemove(user.id);
});

describe('GET /users', () => {
  it('should respond with all users', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);
    expect(response.body.length).toBe(1);
  });
});

describe('GET /users/:id', () => {
  it('should response with status 404', async () => {
    await request(app)
      .get('/users/123456789012123456789012')
      .expect(404);
  });

  it('should response with status 400', async () => {
    await request(app)
      .get('/users/123')
      .expect(400);
  });
});
