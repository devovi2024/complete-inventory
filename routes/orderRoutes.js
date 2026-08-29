import { Router } from 'express';
import { crud } from '../utils/crud.js';
import Order from '../models/Order.js';
import { listOrders, createOrder, updateOrder, updateStatus, processFIFO } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
const router = Router(); const handlers = crud(Order, { populate: 'customer_id product_id' });
router.use(protect); router.get('/', listOrders); router.post('/', createOrder); router.get('/:id', handlers.get); router.put('/:id', updateOrder); router.delete('/:id', handlers.remove); router.post('/:id/process-fifo', processFIFO); router.put('/:id/status', updateStatus);
export default router;
