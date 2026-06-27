import type { Role } from './types';

const permissions: Record<Role, string[]> = {
  Admin: ['manage:all'],
  'ESG Manager': ['read:all', 'write:activity', 'write:factor', 'review:inventory', 'export:report'],
  'Data Owner': ['read:assigned', 'write:activity', 'write:evidence'],
  Reviewer: ['read:all', 'review:inventory', 'comment:verification'],
  Viewer: ['read:dashboard', 'read:report']
};

export function can(role: Role, permission: string): boolean {
  return permissions[role].includes('manage:all') || permissions[role].includes(permission);
}
