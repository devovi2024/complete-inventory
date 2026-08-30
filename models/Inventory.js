import mongoose from 'mongoose';
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from '../config/constants.js';

const layer = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit_cost: {
    type: Number,
    required: true,
    min: 0
  },
  purchase_date: {
    type: Date,
    default: Date.now
  },
  remaining: {
    type: Number,
    required: true,
    min: 0
  },
  note: String
});

const schema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: INVENTORY_CATEGORIES,
    required: true
  },
  unit: {
    type: String,
    enum: INVENTORY_UNITS,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  total_qty: {
    type: Number,
    default: 0,
    min: 0
  },
  avg_cost: {
    type: Number,
    default: 0,
    min: 0
  },
  reorder_level: {
    type: Number,
    default: 10,
    min: 0
  },
  fifo_layers: [layer],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

schema.index({ category: 1, status: 1, isDeleted: 1 });
schema.index({ product_name: 'text' });

export default mongoose.model('Inventory', schema);