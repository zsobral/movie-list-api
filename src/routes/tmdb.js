'use strict';

const express = require('express');
const joi = require('joi');

const theMovieDb = require('../libs/the-movie-db');
const requireAuthentication = require('../middlewares/require-authentication');
const validator = require('../middlewares/validator');

const router = express.Router();

/**
 * @api {get} /tmdb/movies Search movies from TMDb
 * @apiName SearchMovies
 * @apiGroup TMDb
 * 
 * @apiParam (Query) {String} query Movie Name
 * 
 * @apiExample Example usage:
 * curl -i http://localhost/tmdb/movies?query=batman
 * 
 * @apiSuccess {Object[]} movies
 * @apiSuccess {Number}   movies.vote_count TMDb Movie vote count
 * @apiSuccess {Number}   movies.id TMDd Movie id
 * @apiSuccess {Boolean}  movies.video
 * @apiSuccess {Number}   movies.vote_average TMDb Movie vote average
 * @apiSuccess {String}   movies.title TMDb Movie title
 * @apiSuccess {Number}   movies.popularity TMDb Movie popularity
 * @apiSuccess {String}   movies.poster_path TMDb Movie poster path
 * @apiSuccess {String}   movies.original_language Movie original language
 * @apiSuccess {String}   movies.original_title Movie original title
 * @apiSuccess {Number[]} movies.genre_ids TMDb Movie genres
 * @apiSuccess {String}   movies.backdrop_path TMDb Movie backdrop path
 * @apiSuccess {Boolean}  movies.adult
 * @apiSuccess {String}   movies.overview TMDb Movie overview
 * @apiSuccess {String}   movies.release_date Movie release date
 * @apiSuccess {Object}   movies.poster TMDb Movie poster urls
 * @apiSuccess {String}   movies.poster.small TMDb Movie url poster small size
 * @apiSuccess {String}   movies.poster.medium TMDb Movie url poster medium size
 * @apiSuccess {String}   movies.poster.large TMDb Movie url poster large size
 * @apiSuccess {Object}   movies.backdrop TMDb Movie backdrops urls
 * @apiSuccess {String}   movies.backdrop.small TMDb Movie url backdrops small size
 * @apiSuccess {String}   movies.backdrop.medium TMDb Movie url backdrops medium size
 * @apiSuccess {String}   movies.backdrop.large TMDb Movie url backdrops large size
 */
router.get(
  '/tmdb/movies',
  requireAuthentication,
  validator({
    query: {
      query: joi
        .string()
        .trim()
        .min(1)
        .required()
    }
  }),
  async (req, res, next) => {
    try {
      const movies = await theMovieDb.find(req.validator.query.query);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @api {get} /tmdb/movies/:id Read details of a Movie from TMDb
 * @apiName GetMovieDetails
 * @apiGroup TMDb
 * 
 * @apiParam {Number} TMDb Movie id
 * 
 * @apiSuccess {Boolean}  adult
 * @apiSuccess {String}   backdrop_path TMDb Movie backdrop path
 * @apiSuccess {Object}   belongs_to_collection
 * @apiSuccess {Number}   budget
 * @apiSuccess {Object[]} genres
 * @apiSuccess {String}   homepage
 * @apiSuccess {Number}   id
 * @apiSuccess {Number}   imdb_id
 * @apiSuccess {String}   original_language
 * @apiSuccess {String}   original_title
 * @apiSuccess {String}   overview
 * @apiSuccess {Number}   popularity
 * @apiSuccess {String}   poster_path
 * @apiSuccess {Object[]} production_companies
 * @apiSuccess {Object[]} production_countries
 * @apiSuccess {String}   release_date
 * @apiSuccess {Number}   revenue
 * @apiSuccess {Number}   runtime
 * @apiSuccess {Object[]} spoken_languages
 * @apiSuccess {String}   status
 * @apiSuccess {String}   tagline
 * @apiSuccess {String}   title
 * @apiSuccess {Boolean}  video
 * @apiSuccess {Number}   vote_average
 * @apiSuccess {Number}   vote_count
 * @apiSuccess {Object}   videos
 * @apiSuccess {Object}   images
 * @apiSuccess {Object}   poster TMDb Movie poster urls
 * @apiSuccess {String}   poster.small TMDb Movie url poster small size
 * @apiSuccess {String}   poster.medium TMDb Movie url poster medium size
 * @apiSuccess {String}   poster.large TMDb Movie url poster large size
 * @apiSuccess {Object}   backdrop TMDb Movie backdrops urls
 * @apiSuccess {String}   backdrop.small TMDb Movie url backdrops small size
 * @apiSuccess {String}   backdrop.medium TMDb Movie url backdrops medium size
 * @apiSuccess {String}   backdrop.large TMDb Movie url backdrops large size
 */
router.get(
  '/tmdb/movies/:id',
  requireAuthentication,
  validator({
    params: {
      id: joi
        .number()
        .integer()
        .positive()
        .required()
    }
  }),
  async (req, res, next) => {
    try {
      const movie = await theMovieDb.findMovieById(req.validator.params.id);

      if (!movie) {
        throw new Error('movie not found');
      }

      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
