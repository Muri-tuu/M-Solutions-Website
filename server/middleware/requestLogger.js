// ESM middleware for request logging and JSON response capture
export function requestLogger(req, res, next) {
  const requestStartTimeMs = Date.now();

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    try {
      // Store a safe, truncated copy of the JSON response for logging
      const text = safeTruncateJSON(body, 1000);
      res.locals.jsonPreview = text;
    } catch (error) {
      res.locals.jsonPreview = '<unserializable json>';
    }
    return originalJson(body);
  };

  res.on('finish', () => {
    const elapsedMs = Date.now() - requestStartTimeMs;
    const previewSuffix = res.locals.jsonPreview ? ` body=${res.locals.jsonPreview}` : '';
    // eslint-disable-next-line no-console
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} ${elapsedMs}ms${previewSuffix}`
    );
  });

  next();
}

function safeTruncateJSON(value, maxLength) {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  if (serialized.length <= maxLength) return serialized;
  return serialized.slice(0, Math.max(0, maxLength - 3)) + '...';
}
