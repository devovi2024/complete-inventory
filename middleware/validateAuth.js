import { body } from 'express-validator';
export const registerRules = [body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'), body('email').isEmail().withMessage('Valid email is required'), body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password needs 8 characters, upper/lowercase, number, and symbol')];
export const loginRules = [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')];
