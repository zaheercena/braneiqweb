'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  apiFetch,
  getToken,
  getWorkspaceId,
  hasPlatformAdminFromToken,
  resolvePlatformAdmin,
  setAuthSession,
} from '../lib/api';

type Profile = {
  isPlatformAdmin?: boolean;
  email: string;
};

/** Resolve platform-admin status from API, JWT, and localStorage; sync session storage. */
export function usePlatformAdmin() {
  const [admin, setAdmin] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    return hasPlatformAdminFromToken() ? true : null;
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAdmin(false);
      setLoading(false);
      return false;
    }

    const jwtAdmin = hasPlatformAdminFromToken(token);
    if (jwtAdmin) {
      setAdmin(true);
    }

    try {
      const profile = await apiFetch<Profile>('/auth/me');
      const isAdmin = resolvePlatformAdmin(profile);
      const workspaceId = getWorkspaceId();
      if (workspaceId) {
        setAuthSession(token, workspaceId, isAdmin, profile.email);
      }
      setAdmin(isAdmin);
      return isAdmin;
    } catch {
      const fallback = resolvePlatformAdmin();
      setAdmin(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isAdmin = admin === true || (!loading && hasPlatformAdminFromToken());
  return { isPlatformAdmin: isAdmin, loading, refresh };
}
