'use strict';

const request = require('request-promise');

const API_KEY = process.env.THE_MOVIE_DB_API_KEY;

const tmdbRequest = request.defaults({
  baseUrl: 'https://api.themoviedb.org/3'
});

// TODO handle rate limit

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
    throw error;
  }
};

exports.findMovieById = async (id) => {
  try {
    const qs = {
      api_key: API_KEY,
      append_to_response: 'videos,images'
    };
    const movie = await tmdbRequest.get(`/movie/${id}`, { qs, json: true });
    return movie;
  } catch (error) {
    // if(error.status_code === 429) // rate limit
    throw error;
  }
};
