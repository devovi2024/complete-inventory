import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import bcrypt from 'bcryptjs';
import { publicUser } from '../utils/token.js';
import { audit } from '../utils/audit.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        ...(req.file ? { image: `/uploads/${req.file.filename}` } : {})
      }
    },
    { new: true, runValidators: true }
  );
  
  res.json({ success: true, user: publicUser(user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  
  if (!(await bcrypt.compare(req.body.currentPassword || '', user.password))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  
  user.password = req.body.newPassword;
  user.mustChangePassword = false;
  await user.save();
  
  await audit(req, 'user.password.changed', 'User', user._id);
  
  res.json({ success: true, message: 'Password changed' });
});

export const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
  const query = { isDeleted: false };
  
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -twoFactorSecret -backupCodes')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    User.countDocuments(query)
  ]);
  
  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowed = {};
  if (req.body.role) allowed.role = req.body.role;
  if (typeof req.body.isVerified === 'boolean') allowed.isVerified = req.body.isVerified;
  
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    allowed,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  await audit(req, 'user.updated', 'User', user._id, allowed);
  
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  await audit(req, 'user.deleted', 'User', user._id);
  
  res.json({ success: true, message: 'User deleted' });
});

export const listSessions = asyncHandler(async (req, res) => {
  const data = await RefreshToken.find({
    user_id: req.user._id,
    revoked_at: null,
    expires_at: { $gt: new Date() }
  })
    .select('user_agent ip createdAt updatedAt expires_at')
    .sort({ updatedAt: -1 })
    .lean();
  
  res.json({ success: true, data });
});

export const revokeSession = asyncHandler(async (req, res) => {
  await RefreshToken.updateOne(
    { _id: req.params.id, user_id: req.user._id, revoked_at: null },
    { revoked_at: new Date() }
  );
  
  res.json({ success: true, message: 'Session revoked' });
});