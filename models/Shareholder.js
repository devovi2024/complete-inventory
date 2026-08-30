import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  note: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  _id: true
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['senior', 'junior'],
    required: true
  },
  investments: {
    type: [investmentSchema],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

schema.virtual('totalInvestment').get(function () {
  return (this.investments || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
});

schema.index({ role: 1, isDeleted: 1 });
schema.index({ name: 1, isDeleted: 1 });

export default mongoose.model('Shareholder', schema);