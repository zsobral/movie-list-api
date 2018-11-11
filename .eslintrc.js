'use strict';

module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    strict: ['error', 'global'],
    'no-var': 'error',
    'prefer-const': 'error'
  }
};
