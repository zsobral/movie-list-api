'use strict';

const request = require('supertest');

const app = require('../src/app');
const db = require('../src/db');
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
  const response = await request(app)
    .post('/api/auth/email')
    .send({ email: user.email, password: user.password});
  cookies = response.header['set-cookie'];
});

afterAll(async () => {
  await User.remove({});
  await Token.remove({});
});

describe('GET /tmdb/movies', () => {
  describe('missing token cookie', () => {
    it('should response with unauthorized error', async () => {
      const response = await request(app)
        .get('/api/tmdb/movies')
        .query({ query: 'nemo' });
      expect(response.body.error.code).toBe('UNAUTHORIZED_ERR');
    });
  });

  describe('missing query', () => {
    it('should return a validation error', async () => {
      const response = await request(app)
        .get('/api/tmdb/movies')
        .set('Cookie', cookies);
      expect(response.body.error.code).toBe('VALIDATION_ERR');
    });
  });

  describe('with query', () => {
    it('should return an array', async () => {
      const response = await request(app)
        .get('/api/tmdb/movies')
        .query({ query: 'nemo' })
        .set('Cookie', cookies);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

describe('GET /tmdb/movies/:id', () => {

  describe('missing token cookie', async () => {
    it('should response with unauthorized error', async () => {
      const response = await request(app)
        .get('/api/tmdb/movies/808');
      expect(response.body.error.code).toBe('UNAUTHORIZED_ERR');
    });
  });

  it('should return an object', async () => {
    const movieId = 808;
    const response = await request(app)
      .get(`/api/tmdb/movies/${movieId}`)
      .set('Cookie', cookies);
    expect(response.body.id).toBe(movieId);
  });

  it('should return an array of length 0', async () => {
    const response = await request(app)
      .get('/api/tmdb/movies/9999999999999')
      .set('Cookie', cookies);
    expect(response.body.error.code).toBe('ERR');
  });
});
