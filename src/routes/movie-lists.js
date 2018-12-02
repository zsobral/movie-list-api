'use strict';

const express = require('express');
const joi = require('joi');

const requireAuthentication = require('../middlewares/require-authentication');
const validator = require('../middlewares/validator');
const theMovieDb = require('../libs/the-movie-db');
const Movie = require('../models/movie');
const MovieList = require('../models/movie-list');

const router = express.Router();

/**
 * @api {post} /movie-lists Create a new movie list
 * @apiName CreateMovieList
 * @apiGroup Movie List
 * 
 * @apiParam {String} title Name of the movie list
 * @apiParam {Number[]} Ids of the TMDb Movies
 */
router.post(
  '/movie-lists',
  requireAuthentication,
  validator({
    body: {
      title: joi
        .string()
        .trim()
        .optional(),
      movies: joi
        .array()
        .items(joi.number())
        .required()
        .min(1)
        .options({ stripUnknown: false })
    }
  }),
  async (req, res, next) => {
    try {
      const movies = [];

      for (const movieId of req.validator.body.movies) {
        let movie = await Movie.findOne({ tmdb_id: movieId });

        if (!movie) {
          movie = await theMovieDb.findMovieById(movieId);

          const trailers = movie.videos.results
            .filter(
              video => video.site === 'YouTube' && video.type === 'Trailer'
            )
            .map(trailer => ({ key: trailer.key, name: trailer.name }));

          movie = new Movie({
            tmdb_id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster,
            backdrop: movie.backdrop,
            trailers,
            genres: movie.genres.map(genre => genre.name),
            release_date: Math.floor(new Date(movie.release_date) / 1000)
          });

          await movie.save();
        }

        movies.push(movie.id);
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

/**
 * @api {get} /movie-lists Read all movie lists
 * @apiName GetAllMovieLists
 * @apiGroup Movie List
 * 
 * @apiSuccess {Object[]} movie_lists List of Movie List
 * @apiSuccess {Object[]} movie_lists.movies Movies of the Movie List
 * @apiSuccess {Object[]} movie_lists.movies.trailers trailers of the Movie from Youtube
 * @apiSuccess {String}   movie_lists.movies.trailers.key Youtube video key
 * @apiSuccess {String}   movie_lists.movies.trailers.name Youtube video name
 * @apiSuccess {String[]} movie_lists.movies.genres Genres of the movie
 * @apiSuccess {Number}   movie_lists.movies.tmdb_id TMDb Movie id
 * @apiSuccess {String}   movie_lists.movies.title Title of the Movie
 * @apiSuccess {String}   movie_lists.movies.overview Overview of the Movie
 * @apiSuccess {Number}   movie_lists.movies.release_date Relase date of the Movie (Unix Timestamp)
 * @apiSuccess {Number}   movie_lists.movies.created_at
 * @apiSuccess {String}   movie_lists.movies.id Id of the Movie
 * @apiSuccess {Object}   movie_lists.user Owner of the Movie List
 * @apiSuccess {String}   movie_lists.user.name
 * @apiSuccess {String}   movie_lists.user.email
 * @apiSuccess {String}   movie_lists.user.id
 * @apiSuccess {Number}   movie_lists.user.created_at
 * @apiSuccess {Number}   movie_lists.created_at Date of the Movie List creation
 * @apiSuccess {String}   movie_lists.id Id of the Movie List
 */
router.get('/movie-lists', async (req, res, next) => {
  try {
    const movieLists = await MovieList.find().populate(['movies', 'user']);
    res.json(movieLists);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /movie-lists/me Read movie lists of authenticated user
 * @apiName MeMovieLists
 * @apiGroup Movie List
 * 
 * @apiSuccess {Object[]} movie_lists List of Movie List
 * @apiSuccess {Object[]} movie_lists.movies Movies of the Movie List
 * @apiSuccess {Object[]} movie_lists.movies.trailers trailers of the Movie from Youtube
 * @apiSuccess {String}   movie_lists.movies.trailers.key Youtube video key
 * @apiSuccess {String}   movie_lists.movies.trailers.name Youtube video name
 * @apiSuccess {String[]} movie_lists.movies.genres Genres of the movie
 * @apiSuccess {Number}   movie_lists.movies.tmdb_id TMDb Movie id
 * @apiSuccess {String}   movie_lists.movies.title Title of the Movie
 * @apiSuccess {String}   movie_lists.movies.overview Overview of the Movie
 * @apiSuccess {Number}   movie_lists.movies.release_date Relase date of the Movie (Unix Timestamp)
 * @apiSuccess {Number}   movie_lists.movies.created_at
 * @apiSuccess {String}   movie_lists.movies.id Id of the Movie
 * @apiSuccess {String}   movie_lists.user Id of the Owner
 * @apiSuccess {Number}   movie_lists.created_at Date of the Movie List creation
 * @apiSuccess {String}   movie_lists.id Id of the Movie List
 */
router.get('/movie-lists/me', requireAuthentication, async (req, res, next) => {
  try {
    const movieLists = await MovieList.find({ user: req.user.id }).populate(
      'movies'
    );
    res.json(movieLists);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /movie-lists/:id Read data of a movie list
 * @apiName GetMovieListsById
 * @apiGroup Movie List
 * 
 * @apiParam {String} id Id of the Movie List
 * 
 * @apiSuccess {Object[]} movies Movies of the Movie List
 * @apiSuccess {Object[]} movies.trailers trailers of the Movie from Youtube
 * @apiSuccess {String}   movies.trailers.key Youtube video key
 * @apiSuccess {String}   movies.trailers.name Youtube video name
 * @apiSuccess {String[]} movies.genres Genres of the movie
 * @apiSuccess {Number}   movies.tmdb_id TMDb Movie id
 * @apiSuccess {String}   movies.title Title of the Movie
 * @apiSuccess {String}   movies.overview Overview of the Movie
 * @apiSuccess {Number}   movies.release_date Relase date of the Movie (Unix Timestamp)
 * @apiSuccess {Number}   movies.created_at
 * @apiSuccess {String}   movies.id Id of the Movie
 * @apiSuccess {Object}   user Owner of the Movie List
 * @apiSuccess {String}   user.name
 * @apiSuccess {String}   user.email
 * @apiSuccess {String}   user.id
 * @apiSuccess {Number}   user.created_at
 * @apiSuccess {Number}   created_at Date of the Movie List creation
 * @apiSuccess {String}   id Id of the Movie List
 */
router.get('/movie-lists/:id', async (req, res, next) => {
  try {
    const movieList = await MovieList.findById(req.params.id).populate(
      'movies'
    );
    res.json(movieList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
