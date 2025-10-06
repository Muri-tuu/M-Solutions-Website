import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { productsRouter } from './routes/products.js';
import { applySeedData } from './data/seed.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();

// Basic security and body parsing
app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Custom request logging with JSON capture
app.use(requestLogger);

// Healthcheck
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'm-solutions-api' });
});

// API routes
app.use('/api/products', productsRouter);

// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server after seeding in-memory data
await applySeedData();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});
