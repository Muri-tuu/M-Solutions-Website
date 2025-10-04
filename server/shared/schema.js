import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  category: z.string().min(1),
  image: z.string().min(1),
  inStock: z.boolean().default(true),
  whatsappLink: z.string().url(),
});

export const productArraySchema = z.array(productSchema);

export function validateProduct(input) {
  return productSchema.parse(input);
}

export function validateProducts(input) {
  return productArraySchema.parse(input);
}
