import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { accounts, createAccount, journal, ledger, trialBalance } from '../controllers/accountingController.js';

const router = Router();

router.use(protect);

router.get('/accounts', accounts);
router.get('/ledger', ledger);
router.get('/trial-balance', trialBalance);

router.post('/accounts',
  authorize('admin'),
  body('code').notEmpty(),
  body('name').notEmpty(),
  body('type').isIn(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']),
  validate,
  createAccount
);

router.post('/journal',
  authorize('admin', 'manager'),
  body('description').notEmpty(),
  body('lines').isArray({ min: 2 }),
  validate,
  journal
);

export default router;