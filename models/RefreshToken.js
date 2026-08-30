import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token_hash: {
    type: String,
    required: true,
    unique: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  revoked_at: Date,
  replaced_by: String,
  user_agent: String,
  ip: String
}, {
  timestamps: true
});

schema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
schema.index({ user_id: 1, revoked_at: 1 });

export default mongoose.model('RefreshToken', schema);