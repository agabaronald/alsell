const PERMISSIONS = {
  VIEW_ANALYTICS: ['superadmin'],
  VIEW_USERS: ['superadmin', 'moderator', 'staff'],
  MANAGE_USERS: ['superadmin', 'moderator'],
  BAN_USERS: ['superadmin', 'moderator'],
  CHANGE_ROLE: ['superadmin'],
  VIEW_LISTINGS: ['superadmin', 'moderator', 'staff'],
  REMOVE_LISTINGS: ['superadmin', 'moderator'],
  FEATURE_LISTINGS: ['superadmin'],
  VIEW_REPORTS: ['superadmin', 'moderator', 'staff'],
  RESOLVE_REPORTS: ['superadmin', 'moderator'],
  VIEW_AUDIT_LOG: ['superadmin'],
  MANAGE_SYSTEM: ['superadmin'],
};

export function can(permission, role) {
  return PERMISSIONS[permission]?.includes(role) ?? false;
}

export default PERMISSIONS;
