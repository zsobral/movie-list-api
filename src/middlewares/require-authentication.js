'use strict';

const User = require('../models/user');
const Token = require('../models/token');
const error = require('../utils/error');

module.exports = async (req, res, next) => {
  try {
    const cookieToken = req.cookies.sid;

    if (!cookieToken) {
      throw new error.UnauthorizedError('missing Authorization header');
    }

    if (!cookieToken.match(/^[A-Za-z0-9_~]{64}$/)) {
      return next(new error.UnauthorizedError('invalid token format'));
    }

    const token = await Token.findById(cookieToken).populate('user');

    if (!token) {
      throw new error.UnauthorizedError('invalid token');
    }

    const now = Math.floor(Date.now() / 1000);
    if (token.expires_at < now) {
      throw new error.UnauthorizedError('expired token');
    };

    req.token = token.id;
    req.user = token.user.toJSON();
    next();
  } catch (error) {
    next(error);
  }
};
