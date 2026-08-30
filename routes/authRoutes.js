import { Router } from 'express';
import { login, logout, profile, refresh, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerRules, loginRules } from '../middleware/validateAuth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', protect, profile);

export default router;