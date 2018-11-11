'use strict';

const request = require('supertest');

const db = require('../src/db');
const app = require('../src/app');

describe('database disconnected', () => {
  it('should response with status 500', async () => {
    await request(app)
      .get('/api/users')
      .expect(500);
  });
});

describe('database connected', () => {
  beforeAll(async () => {
    await db.connect();
  });

  it('should response with status 200', async () => {
    await request(app)
      .get('/api/users')
      .expect(200);
  });
});
