'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  movies: [{
    tmdb_id: { type: Number },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster: { type: String },
    videos: [],
    genres: [String],
    release_date: { type: Number }
  }],
  created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  updated_at: { type: Number }
});

movieListSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('MovieList', movieListSchema);
