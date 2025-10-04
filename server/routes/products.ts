import express from "express";
import type { Product } from "../../shared/schema.js";
import { MemStorage } from "../storage/MemStorage.js";

export function createProductRouter(storage: MemStorage<Product>) {
  const router = express.Router();

  router.get("/api/products", (_req, res) => {
    const products = storage.getAll();
    res.json(products);
  });

  router.get("/api/products/:id", (req, res) => {
    const product = storage.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });

  return router;
}
