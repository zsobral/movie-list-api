'use strict';

const express = require('express');

const dbConnected = require('../middlewares/db-connected');
const authRouter = require('./auth');
const logoutRouter = require('./logout');
const usersRouter = require('./users');
const tmdbRouter = require('./tmdb');
const movieListsRouter = require('./movie-lists');

const router = express.Router();

router.use(dbConnected);
router.use(authRouter);
router.use(logoutRouter);
router.use(usersRouter);
router.use(tmdbRouter);
router.use(movieListsRouter);

router.use('/healthz', (req, res) => {
  res.send("I'm okay!");
});

module.exports = router;
