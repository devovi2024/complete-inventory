import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  company_name: {
    type: String,
    default: 'Two M-s Veil'
  },
  company_address: String,
  company_phone: String,
  company_email: String,
  company_website: String,
  company_tin: String,
  factory_name: String,
  factory_location: String,
  shift_start: String,
  shift_end: String,
  break_time: Number,
  weekly_off: String,
  working_days: [String],
  currency: {
    type: String,
    default: 'BDT'
  },
  tax_rate: {
    type: Number,
    default: 0
  },
  invoice_prefix: {
    type: String,
    default: 'INV-'
  },
  payment_terms: String,
  default_discount: {
    type: Number,
    default: 0
  },
  default_advance: {
    type: Number,
    default: 0
  },
  default_unit: String,
  quality_standard: String,
  lead_time: Number,
  overtime_allowed: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  email_alerts: {
    type: Boolean,
    default: false
  },
  sms_alerts: {
    type: Boolean,
    default: false
  },
  low_stock_alerts: {
    type: Boolean,
    default: true
  },
  attendance_alerts: {
    type: Boolean,
    default: false
  },
  low_stock_threshold: {
    type: Number,
    default: 10
  },
  auto_backup: {
    type: Number,
    default: 24
  }
}, {
  timestamps: true
});

export default mongoose.model('Setting', schema);