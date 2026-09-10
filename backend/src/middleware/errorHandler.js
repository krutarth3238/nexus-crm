class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  const message =
    statusCode === 500
      ? 'Something went wrong. Please try again.'
      : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}

module.exports = {
  AppError,
  errorHandler,
};