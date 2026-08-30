import { Router } from 'express';
import { financial, profitLoss, valuation } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/financial', financial);
router.get('/profit-loss', profitLoss);
router.get('/valuation', valuation);

export default router;