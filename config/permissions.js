export const MODULES = ['customers', 'orders', 'inventory', 'employees', 'attendance', 'reports', 'settings', 'users'];
const all = { view: true, create: true, edit: true, delete: true };
const readOnly = { view: true, create: false, edit: false, delete: false };
const manager = { view: true, create: true, edit: true, delete: false };
export const ROLE_PERMISSIONS = {
  admin: Object.fromEntries(MODULES.map(module => [module, all])),
  manager: { customers: manager, orders: manager, inventory: manager, employees: manager, attendance: manager, reports: readOnly, settings: readOnly, users: readOnly },
  staff: { customers: { ...readOnly, create: true }, orders: { ...readOnly, create: true }, inventory: readOnly, employees: readOnly, attendance: { view: true, create: true, edit: true, delete: false }, reports: readOnly, settings: readOnly, users: readOnly }
};
export function hasPermission(role, module, action) { return Boolean(ROLE_PERMISSIONS[role]?.[module]?.[action]); }
