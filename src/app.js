'use strict';

const express = require('express');

const routes = require('./routes');
const error = require('./utils/error');

const app = express();

if (process.env.NODE_ENV === 'test') {
  console.log = () => {};
}

app.disable('x-powered-by');
app.use(express.json());
app.use('/api', routes);

app.use('*', (req, res, next) => {
  next(new error.NotFoundError("api endpoint not found"));
});

app.use((err, req, res, next) => {
  error.handleError(err, res);
});

module.exports = app;
