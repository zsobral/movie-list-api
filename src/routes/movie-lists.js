'use strict';

const express = require('express');
const joi = require('joi');

const requireAuthentication = require('../middlewares/require-authentication');
const validator = require('../middlewares/validator');
const theMovieDb = require('../libs/the-movie-db');
const MovieList = require('../models/movie-list');

const router = express.Router();

router.post('/movie-list',
  requireAuthentication,
  validator({
    body: {
      title: joi.string().trim().optional(),
      movies: joi.array().items(joi.number()).required().min(1).options({ stripUnknown: false })
    }
  }),
  async (req, res, next) => {
    try {
      const movies = [];

      for (const movieId of req.validator.body.movies) {
        const movie = await theMovieDb.findMovieById(movieId);

        movies.push({
          tmdb_id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          videos: movie.videos,
          genres: movie.genres.map(genre => genre.name),
          release_date: Math.floor(new Date(movie.release_date) / 1000)
        });
      }

      const movieList = new MovieList({
        user: req.user.id,
        movies: movies
      });

      if (typeof req.validator.body.title !== 'undefined') {
        movieList.title = req.validator.body.title;
      }
      await movieList.save();
      res.json(movieList.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

router.get('/movie-list',
  async (req, res, next) => {
    try {
      const movieLists = await MovieList.find();
      res.json(movieLists);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/movie-list/me',
  requireAuthentication,
  async (req, res, next) => {
    try {
      const movieLists = await MovieList.find({ user: req.user.id });
      res.json(movieLists);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
