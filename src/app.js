'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const error = require('./utils/error');

const app = express();

if (process.env.NODE_ENV === 'test') {
  console.log = () => {};
}

app.disable('x-powered-by');

if (process.env.CORS) {
  const cors = require('cors');
  app.use(cors());
}

if (process.env.NODE_ENV === 'production') {
  const morgan = require('morgan');
  app.use(morgan('short'));
}

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use('/api', routes);

app.use('*', (req, res, next) => {
  next(new error.NotFoundError('api endpoint not found'));
});

app.use((err, req, res, next) => {
  error.handleError(err, res);
});

module.exports = app;
