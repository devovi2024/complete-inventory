import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Valid email is required']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'staff'
  },
  phone: String,
  image: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationTokenHash: String,
  verificationExpires: Date,
  resetTokenHash: String,
  resetExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  backupCodes: {
    type: [String],
    select: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date
}, {
  timestamps: true
});

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.matchPassword = function(value) {
  return bcrypt.compare(value, this.password);
};

export default mongoose.model('User', schema);