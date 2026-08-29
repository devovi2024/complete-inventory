import mongoose from 'mongoose';
const schema = new mongoose.Schema({ actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, action: { type: String, required: true }, entity: String, entity_id: mongoose.Schema.Types.ObjectId, ip: String, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
schema.index({ actor: 1, createdAt: -1 }); schema.index({ entity: 1, entity_id: 1, createdAt: -1 });
export default mongoose.model('AuditLog', schema);
