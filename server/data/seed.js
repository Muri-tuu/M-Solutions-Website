import { randomUUID } from 'crypto';
import { GlobalMem } from './memStorage.js';
import { validateProducts } from '../shared/schema.js';

const PRODUCTS_KEY = 'products';

function makeProduct({ name, description, price, originalPrice, category, image, whatsappLink, inStock = true }) {
  return {
    id: randomUUID(),
    name,
    description,
    price,
    originalPrice,
    category,
    image,
    inStock,
    whatsappLink,
  };
}

export async function applySeedData() {
  if (GlobalMem.has(PRODUCTS_KEY)) return;

  const seedProducts = [
    makeProduct({
      name: 'Engineering Set',
      description: 'Complete sets for every drawing, every detail.',
      price: 850,
      originalPrice: 1000,
      category: 'Academic',
      image: '/assets/images/product-1.jpg',
      whatsappLink: 'https://wa.me/p/24656686300637687/254115594826',
    }),
    makeProduct({
      name: 'FX-82MS Scientific Calculator',
      description: '240 functions, 2-line display.',
      price: 750,
      originalPrice: 800,
      category: 'Academic',
      image: '/assets/images/product-2.jpg',
      whatsappLink: 'https://wa.me/p/24547916364867958/254115594826',
    }),
    makeProduct({
      name: 'FX-991ES Plus Scientific Calculator',
      description: 'Natural textbook display with 417 functions.',
      price: 1900,
      originalPrice: 2000,
      category: 'Academic',
      image: '/assets/images/product-3.jpg',
      whatsappLink: 'https://wa.me/p/31485286737784461/254115594826',
    }),
    makeProduct({
      name: 'Oraimo × M Solutions',
      description: 'Premium tech accessories and exclusive deals.',
      price: 0,
      category: 'Affiliate',
      image: '/assets/images/product-4.jpg',
      whatsappLink: 'https://ke.oraimo.com/?affiliate_code=ntxl3vke',
    }),
    makeProduct({
      name: 'Overalls',
      description: 'Premium quality workwear in multiple colors.',
      price: 1250,
      originalPrice: 1500,
      category: 'Apparel',
      image: '/assets/images/product-5.jpg',
      whatsappLink: 'https://wa.me/p/31352915137686576/254115594826',
    }),
    makeProduct({
      name: 'Browse Full Catalog',
      description: 'Discover all campus essentials and tech solutions.',
      price: 0,
      category: 'Catalog',
      image: '/assets/images/product-6.jpg',
      whatsappLink: 'https://wa.me/c/254115594826',
    }),
  ];

  // Validate and store
  const validated = validateProducts(seedProducts);
  GlobalMem.put(PRODUCTS_KEY, validated);
}

export function getAllProducts() {
  return GlobalMem.get(PRODUCTS_KEY) ?? [];
}

export function getProductById(id) {
  const list = getAllProducts();
  return list.find((p) => p.id === id) ?? null;
}
