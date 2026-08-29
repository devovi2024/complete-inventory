import crypto from 'node:crypto';
import RefreshToken from '../models/RefreshToken.js';
import { signToken } from './token.js';

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
export async function issueRefreshToken(userId, req) { const raw = crypto.randomBytes(48).toString('base64url'); const expires = new Date(Date.now() + Number(process.env.REFRESH_TOKEN_DAYS || 30) * 86400000); await RefreshToken.create({ user_id: userId, token_hash: digest(raw), expires_at: expires, ip: req.ip, user_agent: req.get('user-agent') }); return raw; }
export async function rotateRefreshToken(raw, req) { const current = await RefreshToken.findOne({ token_hash: digest(raw), revoked_at: null }).populate('user_id'); if (!current || current.expires_at <= new Date() || current.user_id?.isDeleted) throw new Error('Invalid refresh token'); current.revoked_at = new Date(); const replacement = await issueRefreshToken(current.user_id._id, req); current.replaced_by = digest(replacement); await current.save(); return { accessToken: signToken(current.user_id._id), refreshToken: replacement, user: current.user_id }; }
export async function revokeRefreshToken(raw) { if (raw) await RefreshToken.updateOne({ token_hash: digest(raw), revoked_at: null }, { revoked_at: new Date() }); }
