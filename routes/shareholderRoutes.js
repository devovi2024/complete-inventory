import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { authorizePermission } from '../middleware/permissions.js';
import { validate } from '../middleware/validate.js';
import { addInvestment, getShareholder, listShareholders } from '../controllers/shareholderController.js';

const router = Router();

router.use(protect, authorizePermission('shareholders'));

router.get('/', listShareholders);
router.get('/:id', getShareholder);
router.post('/:id/investments',
  body('amount').isFloat({ gt: 0 }),
  body('date').optional().isISO8601(),
  validate,
  addInvestment
);

export default router;