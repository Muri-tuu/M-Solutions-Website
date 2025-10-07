import Order from '../models/Order.js';
import { initiateStkPush } from '../services/mpesa.js';

export async function createOrder(req, res) {
  try {
    const { customer, items, total, paymentMode } = req.body;
    if (!customer || !items || !total || !paymentMode) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const order = await Order.create({ customer, items, total, paymentMode, status: paymentMode === 'COD' ? 'unpaid' : 'pending_payment' });

    if (paymentMode === 'M-PESA') {
      try {
        const stk = await initiateStkPush({ phone: customer.phone, amount: total, orderId: order._id });
        return res.status(201).json({ order, stk });
      } catch (err) {
        return res.status(500).json({ message: 'Failed to initiate M-Pesa', error: err.message });
      }
    }

    res.status(201).json({ order });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create order' });
  }
}

export async function getOrderStatus(req, res) {
  try {
    const order = await Order.findById(req.params.id).select('status mpesaReceipt createdAt');
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch status' });
  }
}

export async function mpesaCallback(req, res) {
  try {
    const { Body } = req.body;
    const resultCode = Body?.stkCallback?.ResultCode;
    const receipt = Body?.stkCallback?.CallbackMetadata?.Item?.find(i => i.Key === 'MpesaReceiptNumber')?.Value;
    const merchantRequestID = Body?.stkCallback?.MerchantRequestID;
    // You would map merchantRequestID to orderId in a real setup (store when initiating)
    if (resultCode === 0 && receipt) {
      await Order.findOneAndUpdate({ mpesaReceipt: null, status: 'pending_payment' }, { status: 'paid', mpesaReceipt: receipt });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Callback processing failed' });
  }
}
