'use strict';

const express = require('express');

const User = require('../models/user');
const requireAuthentication = require('../middlewares/require-authentication');

const router = express.Router();

router.use(requireAuthentication);

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
