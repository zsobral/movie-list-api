'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  _id: { type: String },
  created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  expires_at: { type: Number },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

tokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Token', tokenSchema);
