// Standardized Global Express Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for server console debugging
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    return res.status(404).json({ success: false, message, errorType: 'CAST_ERROR' });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    return res.status(400).json({ success: false, message, errorType: 'DUPLICATE_FIELD' });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message, errorType: 'VALIDATION_ERROR' });
  }

  // JWT Token Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token, authorization denied', errorType: 'INVALID_TOKEN' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired, please log in again', errorType: 'TOKEN_EXPIRED' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errorType: 'SERVER_ERROR',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// 404 Route Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`API Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
