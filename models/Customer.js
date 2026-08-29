import mongoose from 'mongoose';
import { CUSTOMER_TYPES } from '../config/constants.js';
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, phone: String, type: { type: String, enum: CUSTOMER_TYPES, default: 'Regular' }, address: String, isDeleted: { type: Boolean, default: false }, deletedAt: Date }, { timestamps: true });
schema.index({ type: 1, isDeleted: 1 }); schema.index({ name: 'text', phone: 'text' });
export default mongoose.model('Customer', schema);
