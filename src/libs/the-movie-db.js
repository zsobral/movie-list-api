'use strict';

const request = require('request-promise');

const API_KEY = process.env.THE_MOVIE_DB_API_KEY;

const tmdbRequest = request.defaults({
  baseUrl: 'https://api.themoviedb.org/3'
});

// TODO handle rate limit

exports.find = async query => {
  try {
    const qs = {
      api_key: API_KEY,
      query,
      include_adult: false
    };
    const { results: movies } = await tmdbRequest.get('/search/movie', {
      qs,
      json: true
    });
    for (const movie of movies) {
      movie.poster =
        movie.poster_path !== null
          ? {
              small: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
              medium: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
              large: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }
          : null;

      movie.backdrop =
        movie.backdrop_path !== null
          ? {
              small: `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`,
              medium: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
              large: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            }
          : null;
    }
    return movies;
  } catch (error) {
    throw error;
  }
};

exports.findMovieById = async id => {
  try {
    const qs = {
      api_key: API_KEY,
      append_to_response: 'videos,images'
    };
    const movie = await tmdbRequest.get(`/movie/${id}`, { qs, json: true });
    movie.poster =
      movie.poster_path !== null
        ? {
            small: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
            medium: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
            large: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          }
        : null;
    movie.backdrop =
      movie.backdrop_path !== null
        ? {
            small: `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`,
            medium: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
            large: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          }
        : null;
    return movie;
  } catch (error) {
    // if(error.status_code === 429) // rate limit
    throw error;
  }
};
