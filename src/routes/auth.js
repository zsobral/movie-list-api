'use strict';

const express = require('express');
const joi = require('joi');
const nanoid = require('nanoid');

const router = express.Router();

const validator = require('../middlewares/validator');
const error = require('../utils/error');
const User = require('../models/user');
const Token = require('../models/token');

router.post('/auth/email',
  validator({
    body: {
      email: joi.string().trim().email().required(),
      password: joi.string().min(6).required()
    }
  }),
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.validator.body.email
      });

      if (!user) {
        throw new error.UnauthorizedError('invalid email');
      }

      if (user.password !== req.validator.body.password) {
        throw new error.UnauthorizedError('invalid password');
      }

      const now = Math.floor(Date.now() / 1000);
      const expire = now + (86400 * 30 * 6); // 6 months
      const tokenId = nanoid(64);
      const token = new Token({
        _id: tokenId,
        user: user.id,
        expires_at: expire
      });
      await token.save();

      res.json({
        token: token.id
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
