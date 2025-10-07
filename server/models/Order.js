import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 }
    }
  ],
  total: { type: Number, required: true, min: 0 },
  paymentMode: { type: String, enum: ['M-PESA', 'COD'], required: true },
  status: { type: String, enum: ['pending_payment', 'paid', 'unpaid', 'delivered'], default: 'pending_payment' },
  mpesaReceipt: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
