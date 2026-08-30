export function requestLogger(req, res, next) {
  const started = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      type: 'http',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - started,
      ip: req.ip
    }));
  });
  next();
}