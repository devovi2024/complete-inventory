export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || (err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500);
  let message = err.message || 'Server error';
  if (err.code === 11000) message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(', ')}`;
  res.status(status).json({ success: false, message, ...(err.details ? { errors: err.details } : {}), ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}) });
}
