export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  BILLING_ADMIN = 'billing_admin',
}

export enum Permission {
  WORKSPACE_MANAGE = 'workspace:manage',
  WORKSPACE_READ = 'workspace:read',
  BRANDS_WRITE = 'brands:write',
  BRANDS_READ = 'brands:read',
  MENTIONS_READ = 'mentions:read',
  MENTIONS_WRITE = 'mentions:write',
  MENTIONS_EXPORT = 'mentions:export',
  ALERTS_WRITE = 'alerts:write',
  ALERTS_READ = 'alerts:read',
  REPORTS_WRITE = 'reports:write',
  REPORTS_EXPORT = 'reports:export',
  TEAM_MANAGE = 'team:manage',
  BILLING_MANAGE = 'billing:manage',
  ADMIN_PANEL = 'admin:panel',
  INTEGRATIONS_MANAGE = 'integrations:manage',
}

export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  [MemberRole.OWNER]: Object.values(Permission).filter((p) => p !== Permission.ADMIN_PANEL),
  [MemberRole.ADMIN]: [
    Permission.WORKSPACE_MANAGE,
    Permission.WORKSPACE_READ,
    Permission.BRANDS_WRITE,
    Permission.BRANDS_READ,
    Permission.MENTIONS_READ,
    Permission.MENTIONS_WRITE,
    Permission.MENTIONS_EXPORT,
    Permission.ALERTS_WRITE,
    Permission.ALERTS_READ,
    Permission.REPORTS_WRITE,
    Permission.REPORTS_EXPORT,
    Permission.TEAM_MANAGE,
    Permission.INTEGRATIONS_MANAGE,
  ],
  [MemberRole.ANALYST]: [
    Permission.WORKSPACE_READ,
    Permission.BRANDS_WRITE,
    Permission.BRANDS_READ,
    Permission.MENTIONS_READ,
    Permission.MENTIONS_WRITE,
    Permission.MENTIONS_EXPORT,
    Permission.ALERTS_WRITE,
    Permission.ALERTS_READ,
    Permission.REPORTS_EXPORT,
  ],
  [MemberRole.VIEWER]: [
    Permission.WORKSPACE_READ,
    Permission.BRANDS_READ,
    Permission.MENTIONS_READ,
    Permission.ALERTS_READ,
  ],
  [MemberRole.BILLING_ADMIN]: [
    Permission.WORKSPACE_READ,
    Permission.BILLING_MANAGE,
  ],
};

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  workspaceId?: string;
  role: MemberRole;
  permissions: Permission[];
  isPlatformAdmin?: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tenantName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
