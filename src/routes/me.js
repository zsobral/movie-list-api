'use strict';

const express = require('express');

const User = require('../models/user');
const Token = require('../models/token');
const requireAuthentication = require('../middlewares/require-authentication');

const router = express.Router();

router.get('/me',
  requireAuthentication,
  (req, res, next) => {
    res.json(req.user);
  }
);

router.get('/me/logout',
  requireAuthentication,
  async (req, res, next) => {
    try {
      await Token.findByIdAndRemove(req.token);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
