/**
 * Middleware to handle unmatched routes (404 Not Found)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error-handling middleware.
 * Formats errors and catches unhandled exceptions across all Express routes.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    if (err.keyValue && ('url' in err.keyValue || 'userId' in err.keyValue)) {
      message = 'This article is already saved in your bookmarks.';
    } else {
      const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
      message = `An item with this ${duplicatedField} already exists.`;
    }
  }

  // Handle Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for: ${err.path}`;
  }

  // Handle JWT verification errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
