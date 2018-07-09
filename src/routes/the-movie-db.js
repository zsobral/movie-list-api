'use strict';

const express = require('express');
const joi = require('joi');

const tmdb = require('../libs/the-movie-db');
const validator = require('../middlewares/validator');

const router = express.Router();

router.get('/tmdb/search',
  validator({
    query: {
      query: joi.string().trim().min(1).required()
    }
  }),
  async (req, res, next) => {
    try {
      const movies = await tmdb.find(req.validator.query.query);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/tmdb/movie/:id',
  validator({
    params: {
      id: joi.number().integer().positive().required()
    }
  }),
  async (req, res, next) => {
    try {
      const movie = await tmdb.findMovieById(req.validator.params.id);

      if(!movie) {
        throw new Error('movie not found');
      }

      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
