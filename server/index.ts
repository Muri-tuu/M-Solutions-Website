import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import { MemStorage } from "./storage/MemStorage.js";
import { type Product } from "../shared/schema.js";
import { seedProducts } from "./seed/products.js";

const app = express();

// Core middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger());

// Storage and seed
const productStorage = new MemStorage<Product>();
seedProducts(productStorage);

// Routes
import { createProductRouter } from "./routes/products.js";
app.use(createProductRouter(productStorage));

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 404 and error handler
app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;
