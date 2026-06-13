'use client';

import { Permission, type JwtPayload } from '@braneiq/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';
const REQUEST_TIMEOUT_MS = 15_000;

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('braneiq_token');
}

export function getWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('braneiq_workspace');
}

export function setAuthSession(
  token: string,
  workspaceId: string,
  isPlatformAdmin = false,
  email?: string,
) {
  localStorage.setItem('braneiq_token', token);
  localStorage.setItem('braneiq_workspace', workspaceId);
  localStorage.setItem('braneiq_is_platform_admin', isPlatformAdmin ? '1' : '0');
  if (email) {
    localStorage.setItem('braneiq_user_email', email);
  }
}

export function clearAuthSession() {
  localStorage.removeItem('braneiq_token');
  localStorage.removeItem('braneiq_workspace');
  localStorage.removeItem('braneiq_is_platform_admin');
  localStorage.removeItem('braneiq_user_email');
}

export function redirectToLogin(reason?: 'expired') {
  if (typeof window === 'undefined') return;
  clearAuthSession();
  const params = new URLSearchParams();
  if (reason === 'expired') params.set('session', 'expired');
  const qs = params.toString();
  window.location.href = qs ? `/login?${qs}` : '/login';
}

export function isPlatformAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('braneiq_is_platform_admin') === '1';
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

/** True when JWT grants platform admin panel access (admin:panel or isPlatformAdmin claim). */
export function hasPlatformAdminFromToken(token?: string | null): boolean {
  const jwt = token ?? getToken();
  if (!jwt) return false;
  const payload = decodeJwtPayload(jwt);
  if (!payload) return false;
  if (payload.isPlatformAdmin === true) return true;
  return payload.permissions?.includes(Permission.ADMIN_PANEL) ?? false;
}

export function resolvePlatformAdmin(profile?: { isPlatformAdmin?: boolean } | null): boolean {
  if (profile?.isPlatformAdmin === true) return true;
  if (hasPlatformAdminFromToken()) return true;
  return isPlatformAdmin();
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = getToken();
  const workspaceId = getWorkspaceId();
  return {
    Authorization: `Bearer ${token ?? ''}`,
    'X-Workspace-Id': workspaceId ?? '',
    'Content-Type': 'application/json',
  };
}

export function parseApiError(text: string, status: number): string {
  try {
    const body = JSON.parse(text) as { message?: string | string[]; error?: string };
    if (Array.isArray(body.message)) return body.message.join(', ');
    if (typeof body.message === 'string') return body.message;
    if (body.error) return body.error;
  } catch {
    // not JSON
  }
  if (status === 401) return 'Not authenticated. Please sign in again.';
  if (status === 403) return 'You do not have access to this workspace.';
  if (status === 400) return text || 'Invalid request.';
  if (status === 0 || text.includes('Failed to fetch')) {
    return `Cannot reach API at ${API_URL}. Is the API server running on port 4000?`;
  }
  return text || `Request failed (${status})`;
}

/** Unauthenticated requests (login/register) with timeout and consistent errors. */
export async function publicApiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string>),
      },
    });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(parseApiError(text, res.status));
    }

    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Is the API server running on port 4000?');
    }
    if (err instanceof TypeError) {
      throw new Error(parseApiError('', 0));
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { ...getAuthHeaders(), ...(init?.headers as Record<string, string>) },
    });
    const text = await res.text();

    if (!res.ok) {
      if (res.status === 401) {
        redirectToLogin('expired');
      }
      throw new Error(parseApiError(text, res.status));
    }

    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check API server.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export { API_URL };
