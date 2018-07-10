'use strict';

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status || 500;
    this.code = 'APP_ERR';
  }

  toObject() {
    return {
      error: {
        code: this.code,
        message: this.message
      }
    };
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.code = 'VALIDATION_ERR';
    this.details = details;
  }

  toObject() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
    this.code = 'NOT_FOUND_ERR';
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
    this.code = 'CONFLICT_ERR';
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
    this.code = 'UNAUTHORIZED_ERR';
  }
}

function handleError(err, res) {
  console.log(err);

  if (err instanceof AppError) {
    return res.status(err.status).json(err.toObject());
  }

  res.status(500).json({ error: { code: 'ERR', message: 'error' } });
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  handleError
};
