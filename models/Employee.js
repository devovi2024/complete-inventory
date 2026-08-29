import mongoose from 'mongoose';
import { EMPLOYEE_STATUSES } from '../config/constants.js';
const schema = new mongoose.Schema({ name: { type: String, required: true }, designation: String, department: String, status: { type: String, enum: EMPLOYEE_STATUSES, default: 'Active' }, phone: String, email: String, address: String, join_date: Date, salary: Number, image: String, isDeleted: { type: Boolean, default: false }, deletedAt: Date }, { timestamps: true });
schema.index({ status: 1, isDeleted: 1 }); schema.index({ name: 'text', department: 'text' });
export default mongoose.model('Employee', schema);
