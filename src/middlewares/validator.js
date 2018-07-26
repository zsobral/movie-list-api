'use strict';

const joi = require('joi');

const error = require('../utils/error');

module.exports = (schema) => {
  return (req, res, next) => {
    const value = {
      params: req.params,
      query: req.query,
      body: req.body
    };
    const result = joi.validate(value, schema, {
      allowUnknown: true,
      stripUnknown: true
    });
    if (result.error) {
      return next(new error.ValidationError('validation error', result.error.details));
    }

    req.validator = result.value;
    next();
  };
};
