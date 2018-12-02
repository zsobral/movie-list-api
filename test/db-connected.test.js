'use strict';

const request = require('supertest');

const db = require('../src/db');
const app = require('../src/app');

describe('database disconnected', () => {
  it('should response with status 500', async () => {
    await request(app)
      .get('/users')
      .expect(500);
  }, 30000);
});

describe('database connected', () => {
  it('should response with status 200', async () => {
    await db.connect();
    await request(app)
      .get('/users')
      .expect(200);
  }, 30000);
});
