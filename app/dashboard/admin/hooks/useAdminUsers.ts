'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* ============================
   RAW BACKEND TYPE
   (lo que realmente llega)
============================ */

interface RawAdminUser {
  id: number;
  email: string;

  global_role?: 'root' | 'admin' | 'support' | null;
  client_role?: 'owner' | 'finops_admin' | 'viewer' | null;

  client_id?: number | null;

  client?: {
    id: number;
    company_name: string;
  } | null;

  company_name?: string | null;

  is_active?: boolean;
  force_password_change?: boolean;
}

/* ============================
   FRONTEND TYPE
============================ */

export interface AdminUser {
  id: number;
  email: string;

  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;

  client_id: number | null;
  company_name: string | null;

  is_active: boolean;
  force_password_change: boolean;
}

/* ============================
   HOOK
============================ */

export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<any>(
        '/api/admin/users',
        { token }
      );

      /**
       * 🔥 NORMALIZACIÓN DE CONTRATO
       */
      const rawUsers: RawAdminUser[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.users)
        ? data.users
        : [];

      const adapted: AdminUser[] = rawUsers.map(
        (u: RawAdminUser) => ({
          id: u.id,
          email: u.email,

          global_role: u.global_role ?? null,
          client_role: u.client_role ?? null,

          client_id:
            u.client_id ?? u.client?.id ?? null,

          company_name:
            u.company_name ??
            u.client?.company_name ??
            null,

          is_active: Boolean(u.is_active),
          force_password_change: Boolean(
            u.force_password_change
          ),
        })
      );

      setUsers(adapted);
    } catch (err) {
      console.error('[useAdminUsers]', err);
      setError('No se pudieron cargar los usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

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
