import mongoose from 'mongoose';
import { ATTENDANCE_STATUSES } from '../config/constants.js';

const schema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employee_name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  check_in: Date,
  check_out: Date,
  status: {
    type: String,
    enum: ATTENDANCE_STATUSES,
    default: 'Present'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

schema.index(
  { employee_id: 1, date: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

schema.index({ date: -1, status: 1, isDeleted: 1 });

export default mongoose.model('Attendance', schema);