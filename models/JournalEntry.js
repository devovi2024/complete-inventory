import mongoose from 'mongoose';

const line = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  debit: {
    type: Number,
    default: 0,
    min: 0
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  memo: String
}, {
  _id: false
});

const schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  reference_type: String,
  reference_id: mongoose.Schema.Types.ObjectId,
  lines: {
    type: [line],
    validate: {
      validator: lines => lines.length >= 2 && lines.reduce((s, l) => s + l.debit, 0) === lines.reduce((s, l) => s + l.credit, 0),
      message: 'Journal debits and credits must balance'
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

schema.index({ date: -1, reference_type: 1 });

export default mongoose.model('JournalEntry', schema);