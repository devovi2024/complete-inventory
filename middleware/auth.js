import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { ROLE_PERMISSIONS } from '../config/permissions.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) { res.status(401); throw new Error('Authentication required'); }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) { res.status(401); throw new Error('User no longer exists'); }
    req.permissions = ROLE_PERMISSIONS[req.user.role] || {};
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) { res.status(403); throw new Error('Insufficient permissions'); }
  next();
};
