'use strict';

const request = require('request-promise');

const API_KEY = process.env.THE_MOVIE_DB_API_KEY;

const tmdbRequest = request.defaults({
  baseUrl: 'https://api.themoviedb.org/3'
});

exports.find = async (query) => {
  try {
    const qs = {
      api_key: API_KEY,
      query,
      include_adult: false
    };
    const movies = await tmdbRequest.get('/search/movie', { qs, json: true });
    return movies.results;
  } catch (error) {
    return error;
  }
};

exports.findMovieById = async (id) => {
  try {
    const qs = {
      api_key: API_KEY
    };
    const movie = await tmdbRequest.get(`/movie/${id}`, { qs, json: true });
    return movie;
  } catch (error) {
    // if(error.status_code === 429) // rate limit
    return error;
  }
};
