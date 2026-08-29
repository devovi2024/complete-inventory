import jwt from 'jsonwebtoken';
export function signToken(id) { return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }); }
export function publicUser(user) { return { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image, isVerified: user.isVerified, mustChangePassword: user.mustChangePassword, twoFactorEnabled: user.twoFactorEnabled }; }
