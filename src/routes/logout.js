'use strict';

const express = require('express');

const Token = require('../models/token');
const requireAuthentication = require('../middlewares/require-authentication');

const router = express.Router();

/**
 * @api {delete} /logout User logout
 * @apiName UserLogout
 * @apiGroup Auth
 */
router.delete('/logout', requireAuthentication, async (req, res, next) => {
  try {
    await Token.findByIdAndRemove(req.token);
    res.clearCookie('token');
    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
