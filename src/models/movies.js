'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  tmdb_id: { type: Number },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster: { type: String },
  videos: [],
  genres: [String],
  release_date: { type: Number }
});

module.exports = mongoose.model('Movie', movieSchema);
