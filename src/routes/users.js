'use strict';

const express = require('express');
const joi = require('joi');

const validator = require('../middlewares/validator');
const requireAuthentication = require('../middlewares/require-authentication');
const error = require('../utils/error');
const User = require('../models/user');

const router = express.Router();

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/users/me', requireAuthentication, (req, res, next) => {
  res.json(req.user);
});

router.get(
  '/users/:id',
  validator({
    params: {
      id: joi
        .string()
        .regex(/^[0-9A-F]{24}$/i)
        .required()
    }
  }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id, '-password');
      if (!user) {
        throw new error.NotFoundError(`User _id "${req.params.id}" not found`);
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/users',
  validator({
    body: {
      name: joi
        .string()
        .trim()
        .min(3)
        .required(),
      email: joi
        .string()
        .trim()
        .email()
        .required(),
      password: joi
        .string()
        .min(6)
        .required()
    }
  }),
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.validator.body.email });
      if (user) {
        throw new error.ConflictError('email already exists');
      }

      const newUser = new User({
        name: req.validator.body.name,
        email: req.validator.body.email,
        password: req.validator.body.password
      });
      await newUser.save();
      res.status(201).json(newUser.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

// router.delete('/users/:id',
//   validator({
//     params: {
//       id: joi.string().regex(/^[0-9A-F]{24}$/i).required()
//     }
//   }),
//   async (req, res, next) => {
//     try {
//       await User.findByIdAndRemove(req.validator.params.id);
//       res.json();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.put('/users/:id',
//   validator({
//     params: {
//       id: joi.string().regex(/^[0-9A-F]{24}$/i).required()
//     },
//     body: {
//       name: joi.string().trim().min(3),
//       email: joi.string().trim().email(),
//       password: joi.string().min(6),
//       avatar: joi.string()
//     }
//   }),
//   async (req, res, next) => {
//     try {
//       if (req.validator.body.email) {
//         const user = await User.findOne({ email: req.validator.body.email });
//         if (user) {
//           throw new error.ConflictError('email already exists');
//         }
//       }

//       await User.findByIdAndUpdate(req.validator.params.id, {
//         ...req.validator.body,
//         updated_at: Math.floor(Date.now() / 1000)
//       });
//       res.json();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
