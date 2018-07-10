'use strict';

const User = require('../models/user');
const Token = require('../models/token');
const error = require('../utils/error');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if(!authHeader) {
      throw new error.UnauthorizedError('missing Authorization header');
    }

    if (!authHeader.match(/^Bearer\ [A-Za-z0-9_~]{64}$/)) {
      return next(new error.UnauthorizedError('invalid token format'));
    }

    const token = await Token.findById(authHeader.split(' ')[1]).populate('user');

    if (!token) {
      throw new error.UnauthorizedError('invalid token');
    }

    const now = Math.floor(Date.now() / 1000);
    if(token.expires_at < now) {
      throw new error.UnauthorizedError('expired token');
    };

    req.user = token.user;
    next();
  } catch (error) {
    next(error);
  }
};
