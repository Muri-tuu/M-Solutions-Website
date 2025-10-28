import { randomUUID } from "node:crypto";
import { productSchema, type Product } from "../../shared/schema.js";
import { MemStorage } from "../storage/MemStorage.js";

export function seedProducts(storage: MemStorage<Product>): void {
  const raw: Array<Omit<Product, "id"> & Partial<Pick<Product, "id">>> = [
    {
      id: randomUUID(),
      name: "Engineering Set",
      description:
        "Complete sets for every drawing, every detail. Professional engineering tools for precision work.",
      price: 850,
      originalPrice: 1000,
      category: "stationery",
      image: "/assets/images/product-1.jpg",
      inStock: true,
      whatsappLink: "https://wa.me/p/24656686300637687/254115594826",
    },
    {
      id: randomUUID(),
      name: "FX-82MS Scientific Calculator",
      description:
        "From class to exams, get the calculator that never fails you. 240 functions, 2-line display.",
      price: 750,
      originalPrice: 800,
      category: "calculator",
      image: "/assets/images/product-2.jpg",
      inStock: true,
      whatsappLink: "https://wa.me/p/24547916364867958/254115594826",
    },
    {
      id: randomUUID(),
      name: "FX-991ES Plus Scientific Calculator",
      description:
        "Advanced functions, exam confidence guaranteed. Natural textbook display with 417 functions.",
      price: 1900,
      originalPrice: 2000,
      category: "calculator",
      image: "/assets/images/product-3.jpg",
      inStock: true,
      whatsappLink: "https://wa.me/p/31485286737784461/254115594826",
    },
    {
      id: randomUUID(),
      name: "Overalls",
      description:
        "Conquer every task with comfort and strength. Premium quality workwear in multiple colors.",
      price: 1250,
      originalPrice: 1500,
      category: "apparel",
      image: "/assets/images/product-5.jpg",
      inStock: true,
      whatsappLink: "https://wa.me/p/31352915137686576/254115594826",
    },
  ];

  const products: Product[] = raw.map((p) => productSchema.parse(p));
  storage.seed(products);
}
