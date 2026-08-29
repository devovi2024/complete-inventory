import AuditLog from '../models/AuditLog.js';
export async function audit(req, action, entity, entityId, metadata = {}) { await AuditLog.create({ actor: req.user?._id, action, entity, entity_id: entityId, ip: req.ip, metadata }); }
