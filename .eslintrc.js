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
    'strict': ['error', 'global'],
    'semi': ['error', 'always'],
    'semi-style': ['error', 'last'],
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'no-var': 'error',
    'prefer-const': 'error',
    'keyword-spacing': ['error'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix']
  }
};
