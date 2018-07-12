'use strict';

const express = require('express');

const Token = require('../models/token');
const requireAuthentication = require('../middlewares/require-authentication');

const router = express.Router();

router.delete('/logout',
  requireAuthentication,
  async (req, res, next) => {
    try {
      await Token.findByIdAndRemove(req.token);
      res.json();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
