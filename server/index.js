import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mpesa', orderRoutes); // reuse callback route /callback

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} / MongoDB connected`);
  });
});
