import { Router } from 'express';
import { createOrder, getOrderStatus, mpesaCallback } from '../controllers/orderController.js';

const router = Router();

router.post('/create', createOrder);
router.get('/:id/status', getOrderStatus);
router.post('/callback', mpesaCallback);

export default router;
