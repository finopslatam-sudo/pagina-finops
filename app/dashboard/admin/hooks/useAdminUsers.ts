'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

/* ============================
   TYPES
============================ */

export interface AdminUser {
  id: number;
  email: string;
  type: 'global' | 'client';
  role: string | null;
  company_name: string | null;
  is_active: boolean;
  force_password_change?: boolean;
  can_edit: boolean;
}

/* ============================
   HOOK
============================ */

export function useAdminUsers() {
  const { token, user: authUser } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const json = await res.json();

      const normalized: AdminUser[] = (json.users ?? []).map(
        (u: any) => ({
          id: u.id,
          email: u.email,
          type: u.global_role ? 'global' : 'client',
          role: u.global_role ?? u.client_role,
          company_name: u.client?.company_name ?? null,
          is_active: u.is_active,
          force_password_change: u.force_password_change,
          can_edit:
            authUser?.global_role === 'root' &&
            u.global_role !== 'root',
        })
      );

      setUsers(normalized);
    } catch (err) {
      console.error('[useAdminUsers]', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [token, authUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
