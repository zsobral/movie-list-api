'use strict';

const express = require('express');
const mongoose = require('mongoose');

const dbConnected = require('../middlewares/db-connected');
const authRouter = require('./auth');
const userRouter = require('./user');
const meRouter = require('./me');
const theMovieDbRouter = require('./the-movie-db');

const router = express.Router();

router.use(dbConnected);
router.use(authRouter);
router.use(userRouter);
router.use(meRouter);
router.use(theMovieDbRouter);

module.exports = router;
