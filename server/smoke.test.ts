import request from "supertest";
import app from "./index.js";

async function run() {
  const health = await request(app).get("/api/health");
  console.log("/api/health", health.status, health.body);

  const products = await request(app).get("/api/products");
  console.log("/api/products", products.status, products.body.length);

  const firstId = products.body[0]?.id;
  if (firstId) {
    const one = await request(app).get(`/api/products/${firstId}`);
    console.log(`/api/products/${firstId}`, one.status, one.body?.id);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
