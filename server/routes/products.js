import { Router } from 'express';
import { getAllProducts, getProductById } from '../data/seed.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  const products = getAllProducts();
  res.json(products);
});

productsRouter.get('/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});
