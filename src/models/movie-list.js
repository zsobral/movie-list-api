'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  updated_at: Number
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
