import { hasPermission, ROLE_PERMISSIONS } from '../config/permissions.js';
export function authorizePermission(module) { return (req, res, next) => { const action = { GET: 'view', POST: 'create', PUT: 'edit', PATCH: 'edit', DELETE: 'delete' }[req.method]; if (!action || !hasPermission(req.user.role, module, action)) { res.status(403); throw new Error('Forbidden: insufficient permission'); } next(); }; }
export function permissionSummary(req, res) { res.json({ success: true, data: ROLE_PERMISSIONS[req.user.role] || {} }); }
