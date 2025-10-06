// Centralized error handling middleware
export function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = typeof err.status === 'number' ? err.status : 500;
  const message = err?.message || 'Internal Server Error';

  // eslint-disable-next-line no-console
  console.error('[error]', { statusCode, message, stack: err?.stack });

  if (res.headersSent) {
    return; // Let default handler deal with it
  }

  res.status(statusCode).json({ error: message });
}
