'use strict';

const db = require('../db');
const error = require('../utils/error');

module.exports = (req, res, next) => {
  const dbState = db.connection.readyState;
  if (dbState !== 1) {
    return next(new Error('can\'t connect to database'));
  }
  next();
};
